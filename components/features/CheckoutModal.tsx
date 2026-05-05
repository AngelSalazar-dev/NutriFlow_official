'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Zap, Crown, Sparkles, CheckCircle2, Lock, CreditCard, Loader2, Receipt, Download, Calendar, User, ArrowRight } from 'lucide-react';
import { PayPalCheckout } from '@/components/ui/paypal-checkout';
import { Button } from '@/components/ui/button';
import { useLang } from '@/context/LangContext';
import { cn } from '@/lib/cn';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  price: number;
  onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, planId, planName, price, onSuccess }: CheckoutModalProps) {
  const { tr, lang } = useLang();
  const [status, setStatus] = React.useState<'checkout' | 'processing' | 'success'>('checkout');
  const [receiptData, setReceiptData] = React.useState<{ id: string; date: string; amount: number } | null>(null);

  const handleSuccess = () => {
    setStatus('processing');
    // Simulate verification
    setTimeout(() => {
      setReceiptData({
        id: `NF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        date: new Date().toLocaleDateString(),
        amount: price
      });
      setStatus('success');
      onSuccess();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={status === 'checkout' ? onClose : undefined}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          key={status}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.8)] overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {status === 'checkout' && (
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {status === 'checkout' && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Summary Side */}
              <div className="w-full md:w-5/12 bg-slate-50 dark:bg-slate-800/40 p-10 border-r border-slate-100 dark:border-slate-800">
                <div className="space-y-8">
                  <motion.div 
                    animate={{ rotate: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className={cn(
                      "w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl",
                      planId === 'pro' ? "bg-gradient-to-br from-amber-400 to-orange-600 text-white" : "bg-gradient-to-br from-emerald-400 to-teal-600 text-white"
                    )}
                  >
                    {planId === 'pro' ? <Sparkles className="h-10 w-10" /> : <Crown className="h-10 w-10" />}
                  </motion.div>
                  
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
                      Selected Plan
                    </h3>
                    <p className="text-4xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tighter">
                      {planName}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-slate-900 dark:text-slate-100">${price}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ Mo</span>
                    </div>
                  </div>

                  <ul className="space-y-4 pt-6">
                    {['sub_feature_chat_unlimited', 'sub_feature_no_ads', 'sub_feature_expert_articles'].map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        {tr(feat as any) || feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Side */}
              <div className="flex-1 p-10">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 mb-6">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                      Secure Checkout
                    </span>
                  </div>
                  <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-4">
                    Upgrade Now
                  </h2>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Your transformation starts here. Secure payment handled by PayPal.
                  </p>
                </div>

                <div className="p-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 shadow-inner">
                  <PayPalCheckout
                    planId={planId}
                    onSuccess={handleSuccess}
                    onError={(msg) => console.error(msg)}
                  />
                </div>

                <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 text-center">
                   <div className="flex items-center justify-center gap-3 opacity-40">
                      <Lock className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">256-bit SSL Encrypted</span>
                   </div>
                </div>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full animate-pulse" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="relative h-24 w-24 border-t-4 border-r-4 border-amber-500 rounded-full"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Verificando transacción...
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto animate-pulse">
                  Estamos confirmando tu suscripción con la pasarela segura. No cierres esta ventana.
                </p>
              </div>
            </div>
          )}

          {status === 'success' && receiptData && (
            <div className="p-10 md:p-14 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-8 shadow-2xl"
              >
                <CheckCircle2 className="h-12 w-12" />
              </motion.div>
              
              <h2 className="text-4xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tighter mb-4">
                ¡Bienvenido a Elite!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-10">
                Tu pago ha sido procesado con éxito. Aquí tienes tu comprobante digital.
              </p>

              {/* Receipt Visual */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 mb-10 text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Receipt className="h-32 w-32" />
                </div>
                
                <div className="grid grid-cols-2 gap-y-6 relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receipt ID</p>
                    <p className="text-sm font-black text-slate-900 dark:text-slate-100">{receiptData.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                    <p className="text-sm font-black text-slate-900 dark:text-slate-100">{receiptData.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                    <p className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase">{planName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount Paid</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${receiptData.amount.toFixed(2)} USD</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Payment</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    <Download className="h-3 w-3" /> Save PDF
                  </Button>
                </div>
              </div>

              <Button
                onClick={onClose}
                className="w-full h-16 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
              >
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
