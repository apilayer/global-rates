export interface IFaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Shared by the FAQ section and the structured data, so what a reader sees and
 * what an answer engine quotes cannot drift apart. Kept out of the component
 * because a server component importing from a "use client" module gets a
 * client reference, not the array.
 */
export const FAQ_DATA: IFaqItem[] = [
  {
    id: "faq-1",
    question: "What is GlobalRates?",
    answer:
      "GlobalRates is a free currency converter and exchange rate tool that converts an amount from one currency into another and shows how that rate has moved over time. It supports live conversion, historical rate charts, currency fluctuation, and side-by-side comparison of what money transfer providers actually pay out. GlobalRates is powered by Exchangerates API.",
  },
  {
    id: "faq-2",
    question: "What is the data source for GlobalRates?",
    answer:
      "GlobalRates is powered by Exchangerates API, a foreign exchange rate API from APILayer. Exchangerates API provides the live rates, currency conversion, historical time-series, and fluctuation data used throughout the tool. Two APILayer services support the experience around it: ipstack detects your country so your home currency is selected automatically, and Mediastack supplies the currency news shown for each pair.",
  },
  {
    id: "faq-3",
    question: "How do I convert one currency into another?",
    answer:
      "Enter an amount in the converter, choose the currency you are converting from and the currency you are converting to, and GlobalRates returns the converted amount at the latest available mid-market rate. Developers can perform the same conversion programmatically using the Exchangerates API convert endpoint.",
  },
  {
    id: "faq-4",
    question: "What is a currency exchange rate?",
    answer:
      "A currency exchange rate is how much one currency is worth when expressed in another. A USD/EUR rate of 0.92 means one US dollar is worth 0.92 euros. The rates shown on GlobalRates are mid-market rates \u2014 the midpoint between the buy and sell price \u2014 which is the rate banks and transfer providers start from before adding their own margin.",
  },
  {
    id: "faq-5",
    question: "What are historical exchange rates?",
    answer:
      "Historical exchange rates are the rates that applied on past dates rather than right now. Exchangerates API supports historical data through its time-series and fluctuation endpoints, letting developers request a date range and retrieve how a currency pair moved across it. GlobalRates uses this to draw its rate charts and to show whether a pair has strengthened or weakened over the period.",
  },
  {
    id: "faq-6",
    question: "What is Exchangerates API?",
    answer:
      "Exchangerates API is a real-time and historical foreign exchange rate API that lets developers retrieve live rates, convert between currencies, and pull historical FX data. It covers currencies worldwide and supports current rates, currency conversion, time-series data, fluctuation data, and a full list of supported currency symbols.",
  },
  {
    id: "faq-7",
    question: "How can I use Exchangerates API for currency conversion?",
    answer:
      "Send a source currency, a target currency, and an amount to the Exchangerates API convert endpoint to receive the converted value along with the rate used. For live rates without conversion, request the latest endpoint with a base currency. For historical analysis, request a date range from the time-series or fluctuation endpoints. Exchangerates API returns structured JSON that can be integrated into websites, mobile apps, and backend services.",
  },
  {
    id: "faq-8",
    question: "What can I build with an exchange rate API like Exchangerates API?",
    answer:
      "Exchangerates API can be used to build currency converters, international pricing and checkout flows, invoicing and accounting tools, travel and remittance apps, financial dashboards, rate alerting services, and analytics tools that track currency trends. Any application that needs to price, report, or compare across currencies can use it as its exchange rate source.",
  },
];
