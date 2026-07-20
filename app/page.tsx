"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { TickerTape } from "@/components/layout/TickerTape";
import { SubNav } from "@/components/layout/SubNav";
import { Footer } from "@/components/layout/Footer";
import { ConverterWidget } from "@/components/features/ConverterWidget";
import { SendMoneyBanner } from "@/components/features/SendMoneyBanner";
import { ConversionTables } from "@/components/features/ConversionTables";
import { ChartSection } from "@/components/features/ChartSection";
import { LiveCurrencyCharts } from "@/components/features/LiveCurrencyCharts";
import { NewsSection } from "@/components/features/NewsSection";
import { currencyService } from "@/services/currency.service";

const FROM = "USD";
const TO = "GHS";
const AMOUNT = "1";

export default function Home() {
  const [rate, setRate] = useState<number>(11.5639);

  useEffect(() => {
    async function fetchInitialRate() {
      try {
        const data = await currencyService.convert(FROM, TO, AMOUNT);
        setRate(data.info.rate);
      } catch {
        // Keep fallback rate
      }
    }
    fetchInitialRate();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <TickerTape />
      <SubNav />

      <main className="flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 md:py-8 space-y-8">
          {/* Page header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-end gap-x-8 gap-y-3 border-b border-(--color-border) pb-1">
              <h1 className="relative pb-2 text-2xl font-semibold text-(--color-text)">
                {FROM} to {TO} overview
              </h1>
              <a
                href="#"
                className="relative pb-2 text-2xl font-semibold text-(--color-text-muted) transition-colors hover:text-(--color-text)"
              >
                Converter
              </a>
              <a
                href="#"
                className="relative pb-2 text-2xl font-semibold text-(--color-text-muted) transition-colors hover:text-(--color-text)"
              >
                Charts
              </a>
            </div>
            <PageMeta rate={rate} />
          </div>

          {/* Converter */}
          <ConverterWidget
            defaultAmount={AMOUNT}
            defaultFrom={FROM}
            defaultTo={TO}
          />

          <p className="flex items-center justify-center text-center text-xs text-(--color-text-muted)">
            <svg
              className="mr-1 h-3.5 w-3.5 min-h-3.5 min-w-3.5"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
            </svg>
            <span>
              We use the mid-market rate for our Converter. This is for informational purposes only. You won&apos;t receive this rate when sending money.{" "}
              <span className="underline">Login to view send rates</span>
            </span>
          </p>

          <SendMoneyBanner />
          <ConversionTables from={FROM} to={TO} rate={rate} />
          <ChartSection from={FROM} to={TO} rate={rate} />
          <LiveCurrencyCharts from={FROM} />
          <NewsSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PageMeta({ rate }: { rate: number }) {
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDate(
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-(--color-text-muted)">
      <span>
        Mid-market rate{" "}
        <span className="font-medium text-(--color-text)">1 {FROM} = {rate.toFixed(4)} {TO}</span>
      </span>
              <span className="inline-flex items-center gap-1 text-(--color-up) font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--color-up) opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-(--color-up)" />
                </span>
                Converter live
              </span>
      {date && (
        <span>
          As of{" "}
          <span className="text-(--color-text) tabular">{date}</span>
        </span>
      )}
    </div>
  );
}
