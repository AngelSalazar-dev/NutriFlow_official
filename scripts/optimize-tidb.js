/**
 * NutriFlow - TiDB Cloud Database Optimization Script
 * 
 * Optimizations:
 * 1. ANALYZE TABLE - Update statistics for query optimizer
 * 2. Check table sizes and row counts
 * 3. Check missing indexes
 * 4. Check for unused/duplicate indexes
 * 5. Show connection status
 * 6. Show slow queries info
 */

const mysql = require('mysql2/promise');

const config = {
  host: process.env.MYSQL_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.MYSQL_PORT || '4000'),
  user: process.env.MYSQL_USER || '3ZxNQLB5VbKt56g.root',
  password: process.env.MYSQL_PASSWORD || '4BLpMj6H4QzcJ8oi',
  database: process.env.MYSQL_DATABASE || 'nutriflow',
  ssl: { rejectUnauthorized: true },
};

async function main() {
  console.log('🔌 Conectando a TiDB Cloud...');
  console.log(`   Host: ${config.host}`);
  console.log(`   Database: ${config.database}\n`);

  const conn = await mysql.createConnection(config);

  try {
    // ============================================
    // 1. Connection Info
    // ============================================
    console.log('═══════════════════════════════════════════');
    console.log('📡 CONNECTION INFO');
    console.log('═══════════════════════════════════════════');

    const [version] = await conn.query('SELECT VERSION() as ver, @@version_comment as comment, CONNECTION_ID() as conn_id');
    console.log(`   Version: ${version[0].ver}`);
    console.log(`   Connection ID: ${version[0].conn_id}\n`);

    // ============================================
    // 2. List all tables with row counts and sizes
    // ============================================
    console.log('═══════════════════════════════════════════');
    console.log('📊 TABLE SIZES & ROW COUNTS');
    console.log('═══════════════════════════════════════════');

    const [tables] = await conn.query(`
      SELECT 
        TABLE_NAME,
        TABLE_ROWS,
        ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'total_size_mb',
        ROUND((DATA_LENGTH / 1024 / 1024), 2) AS 'data_mb',
        ROUND((INDEX_LENGTH / 1024 / 1024), 2) AS 'index_mb',
        ROUND((INDEX_LENGTH / NULLIF(DATA_LENGTH, 0)) * 100, 1) AS 'index_ratio_pct'
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ?
        AND TABLE_TYPE = 'BASE TABLE'
      ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC
    `, [config.database]);

    console.log(`\n   ${'Table'.padEnd(30)} ${'Rows'.padStart(10)} ${'Total MB'.padStart(10)} ${'Data MB'.padStart(10)} ${'Idx MB'.padStart(10)} ${'Idx%'.padStart(8)}`);
    console.log('   ' + '─'.repeat(80));

    let totalMB = 0;
    let totalRows = 0;

    for (const t of tables) {
      const rowStr = `   ${t.TABLE_NAME.padEnd(30)} ${String(t.TABLE_ROWS).padStart(10)} ${String(t.total_size_mb).padStart(10)} ${String(t.data_mb).padStart(10)} ${String(t.index_mb).padStart(10)} ${String(t.index_ratio_pct).padStart(7)}%`;
      console.log(rowStr);
      totalMB += parseFloat(t.total_size_mb);
      totalRows += parseInt(t.TABLE_ROWS);
    }

    console.log('   ' + '─'.repeat(80));
    console.log(`   ${'TOTAL'.padEnd(30)} ${String(totalRows).padStart(10)} ${totalMB.toFixed(2).padStart(10)} MB\n`);

    // ============================================
    // 3. Show indexes per table
    // ============================================
    console.log('═══════════════════════════════════════════');
    console.log('🔑 INDEXES PER TABLE');
    console.log('═══════════════════════════════════════════');

    const [indexes] = await conn.query(`
      SELECT 
        TABLE_NAME,
        INDEX_NAME,
        GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS columns,
        NON_UNIQUE,
        INDEX_TYPE
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = ?
      GROUP BY TABLE_NAME, INDEX_NAME, NON_UNIQUE, INDEX_TYPE
      ORDER BY TABLE_NAME, INDEX_NAME
    `, [config.database]);

    let currentTable = '';
    for (const idx of indexes) {
      if (idx.TABLE_NAME !== currentTable) {
        currentTable = idx.TABLE_NAME;
        console.log(`\n   📁 ${currentTable}:`);
      }
      const type = idx.NON_UNIQUE == 0 ? '🔒 UNIQUE' : '📌 INDEX';
      console.log(`      ${type} ${idx.INDEX_NAME} (${idx.columns}) [${idx.INDEX_TYPE}]`);
    }
    console.log('');

    // ============================================
    // 4. Check for duplicate indexes
    // ============================================
    console.log('═══════════════════════════════════════════');
    console.log('⚠️  CHECKING FOR DUPLICATE INDEXES');
    console.log('═══════════════════════════════════════════');

    const [duplicates] = await conn.query(`
      SELECT 
        s.TABLE_NAME,
        s.INDEX_NAME,
        GROUP_CONCAT(s.COLUMN_NAME ORDER BY s.SEQ_IN_INDEX) AS columns,
        s.NON_UNIQUE
      FROM information_schema.STATISTICS s
      WHERE s.TABLE_SCHEMA = ?
      GROUP BY s.TABLE_NAME, s.INDEX_NAME, s.NON_UNIQUE
      HAVING COUNT(*) > 0
      ORDER BY s.TABLE_NAME
    `, [config.database]);

    // Check for indexes with same columns
    const indexMap = {};
    for (const dup of duplicates) {
      const key = `${dup.TABLE_NAME}|${dup.columns}`;
      if (!indexMap[key]) indexMap[key] = [];
      indexMap[key].push(dup.INDEX_NAME);
    }

    let foundDuplicates = false;
    for (const [key, names] of Object.entries(indexMap)) {
      if (names.length > 1) {
        foundDuplicates = true;
        console.log(`   ⚠️  ${key}: ${names.join(', ')}`);
      }
    }
    if (!foundDuplicates) {
      console.log('   ✅ No duplicate indexes found.\n');
    }

    // ============================================
    // 5. Check foreign key constraints
    // ============================================
    console.log('═══════════════════════════════════════════');
    console.log('🔗 FOREIGN KEY CONSTRAINTS');
    console.log('═══════════════════════════════════════════');

    const [fks] = await conn.query(`
      SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ?
        AND REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY TABLE_NAME, CONSTRAINT_NAME
    `, [config.database]);

    if (fks.length === 0) {
      console.log('   ℹ️  No foreign key constraints defined.\n');
    } else {
      for (const fk of fks) {
        console.log(`   ${fk.TABLE_NAME}.${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME} (${fk.CONSTRAINT_NAME})`);
      }
      console.log('');
    }

    // ============================================
    // 6. ANALYZE ALL TABLES (update optimizer stats)
    // ============================================
    console.log('═══════════════════════════════════════════');
    console.log('📈 ANALYZING TABLES (updating optimizer stats)...');
    console.log('═══════════════════════════════════════════');

    const tableNames = tables.map(t => t.TABLE_NAME);
    for (const tableName of tableNames) {
      try {
        await conn.query(`ANALYZE TABLE \`${tableName}\``);
        console.log(`   ✅ ${tableName} analyzed`);
      } catch (err) {
        console.log(`   ❌ ${tableName}: ${err.message}`);
      }
    }
    console.log('');

    // ============================================
    // 7. Check table fragmentation
    // ============================================
    console.log('═══════════════════════════════════════════');
    console.log('🧹 TABLE FRAGMENTATION CHECK');
    console.log('═══════════════════════════════════════════');

    const [frag] = await conn.query(`
      SELECT 
        TABLE_NAME,
        TABLE_ROWS,
        ROUND(DATA_LENGTH / 1024 / 1024, 2) AS data_mb,
        ROUND(DATA_FREE / 1024 / 1024, 2) AS free_mb,
        ROUND((DATA_FREE / NULLIF(DATA_LENGTH, 0)) * 100, 1) AS frag_pct
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ?
        AND TABLE_TYPE = 'BASE TABLE'
        AND DATA_FREE > 0
      ORDER BY DATA_FREE DESC
    `, [config.database]);

    if (frag.length === 0) {
      console.log('   ✅ No significant fragmentation detected.\n');
    } else {
      for (const f of frag) {
        const icon = parseFloat(f.frag_pct) > 30 ? '⚠️' : 'ℹ️';
        console.log(`   ${icon} ${f.TABLE_NAME}: ${f.frag_pct}% fragmented (${f.free_mb} MB free)`);
      }
      console.log('');
    }

    // ============================================
    // 8. Show variables & connection pool info
    // ============================================
    console.log('═══════════════════════════════════════════');
    console.log('⚙️  TIDB VARIABLES');
    console.log('═══════════════════════════════════════════');

    const [vars] = await conn.query(`
      SELECT @@max_connections AS max_conn,
             @@wait_timeout AS wait_timeout,
             @@interactive_timeout AS interactive_timeout,
             @@innodb_buffer_pool_size AS buffer_pool,
             @@tidb_mem_quota_query AS mem_quota_query,
             @@tidb_distsql_scan_concurrency AS distsql_concurrency,
             @@tidb_index_lookup_concurrency AS index_concurrency
    `);

    for (const [key, val] of Object.entries(vars[0])) {
      console.log(`   ${key}: ${val}`);
    }
    console.log('');

    // ============================================
    // 9. Recommendations
    // ============================================
    console.log('═══════════════════════════════════════════');
    console.log('💡 RECOMMENDATIONS');
    console.log('═══════════════════════════════════════════');

    // Check tables without primary keys
    const [noPK] = await conn.query(`
      SELECT t.TABLE_NAME
      FROM information_schema.TABLES t
      LEFT JOIN (
        SELECT DISTINCT TABLE_NAME
        FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = ? AND INDEX_NAME = 'PRIMARY'
      ) pk ON t.TABLE_NAME = pk.TABLE_NAME
      WHERE t.TABLE_SCHEMA = ?
        AND t.TABLE_TYPE = 'BASE TABLE'
        AND pk.TABLE_NAME IS NULL
    `, [config.database, config.database]);

    if (noPK.length > 0) {
      console.log(`   ⚠️  Tables WITHOUT primary key: ${noPK.map(t => t.TABLE_NAME).join(', ')}`);
      console.log('      → TiDB performs better with explicit primary keys.\n');
    } else {
      console.log('   ✅ All tables have primary keys.\n');
    }

    // Check for large tables that might benefit from partitioning
    const largeTables = tables.filter(t => parseFloat(t.total_size_mb) > 10);
    if (largeTables.length > 0) {
      console.log(`   ℹ️  Large tables (>10MB): ${largeTables.map(t => t.TABLE_NAME).join(', ')}`);
      console.log('      → Consider partitioning if these grow significantly.\n');
    }

    console.log('═══════════════════════════════════════════');
    console.log('✅ OPTIMIZATION COMPLETE');
    console.log('═══════════════════════════════════════════');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await conn.end();
    console.log('🔌 Connection closed.\n');
  }
}

main();
