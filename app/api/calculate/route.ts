// API Route: POST /api/calculate
// Calculates gross earnings, total deductions, and net salary
// Returns calculated values for preview before saving to database
// No Supabase interaction - pure calculation endpoint

import { NextRequest, NextResponse } from 'next/server';
import { numberToWords } from '@/lib/utils';
import { ApiResponse } from '@/types';

interface CalculateRequest {
  earnings: Array<{ name: string; amount: number }>;
  deductions: Array<{ name: string; amount: number }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculateRequest = await request.json();

    // Validate input
    if (!body.earnings || !body.deductions) {
      return NextResponse.json(
        { success: false, error: 'Missing earnings or deductions' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Calculate totals
    const grossEarnings = body.earnings.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalDeductions = body.deductions.reduce((sum, item) => sum + (item.amount || 0), 0);
    const netSalary = grossEarnings - totalDeductions;
    const netSalaryInWords = numberToWords(netSalary);

    return NextResponse.json(
      {
        success: true,
        data: {
          grossEarnings,
          totalDeductions,
          netSalary,
          netSalaryInWords,
        },
        message: 'Calculations completed successfully',
      } as ApiResponse<any>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Calculation Error:', error);
    return NextResponse.json(
      { success: false, error: 'Calculation failed' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
