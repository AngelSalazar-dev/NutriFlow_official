'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLang } from '@/context/LangContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tr } = useLang();
  const [isVerifying, setIsVerifying] = React.useState(true);
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/subscriptions/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (response.ok) {
          setIsSuccess(true);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald-700" />
              <p className="text-stone-600">{tr('sub_verify_payment')}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!isSuccess) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-stone-600">{tr('sub_verify_error')}</p>
              <Button className="mt-4" onClick={() => router.push('/subscription')}>
                {tr('sub_verify_back')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-700 mx-auto mb-4" />
            <CardTitle className="text-2xl">{tr('sub_success_title')}</CardTitle>
            <CardDescription>
              {tr('sub_success_subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-stone-600">
              {tr('sub_success_message')}
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/dashboard">
                <Button variant="outline">{tr('sub_success_dashboard')}</Button>
              </Link>
              <Link href="/exercise">
                <Button>{tr('sub_success_explore')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="max-w-md mx-auto py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald-700" />
              <p className="text-stone-600">Cargando...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    }>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
