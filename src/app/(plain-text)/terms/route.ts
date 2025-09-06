import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(
    `TERMS & CONDITIONS
==================

1. Acceptance of Terms
By accessing or using this service, you agree to be bound by these Terms & Conditions.

2. Use of Service
You agree not to misuse the service. Any unauthorized access, data scraping, or reverse engineering is strictly prohibited.

3. Intellectual Property
All rights, titles, and interests in and to the service are owned by the company.

4. Limitation of Liability
We are not responsible for any damages or losses arising from the use of this service.

5. Governing Law
These Terms & Conditions are governed by applicable laws in your jurisdiction.

-------------------------
Last Updated: September 5, 2025`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
