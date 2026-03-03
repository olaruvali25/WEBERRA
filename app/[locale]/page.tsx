import { unstable_setRequestLocale } from "next-intl/server";

import { LandingPage } from "@/src/components/landing-page";
import type { AppLocale } from "@/src/i18n/routing";

export default function HomePage({ params }: { params: { locale: AppLocale } }) {
  unstable_setRequestLocale(params.locale);

  return <LandingPage locale={params.locale} />;
}
