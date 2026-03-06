// API Route: POST /api/payslips/pdf
// Generates a PDF payslip from payslip data
// Uses jsPDF and html2canvas for PDF generation
// Supabase Integration: Retrieves payslip data including earnings and deductions

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiResponse, PayslipTemplate } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payslipId } = body;

    if (!payslipId) {
      return NextResponse.json(
        { success: false, error: 'Payslip ID is required' } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Fetch payslip data from Supabase
    // The 'payslips' table contains all payslip information
    const { data: payslip, error: payslipError } = await supabaseAdmin
      .from('payslips')
      .select('*')
      .eq('id', payslipId)
      .single();

    if (payslipError || !payslip) {
      console.error('Supabase Error - Fetch Payslip:', payslipError);
      return NextResponse.json(
        { success: false, error: 'Payslip not found' } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Fetch earnings from Supabase earnings table
    // Links to payslip via payslip_id foreign key
    const { data: earnings, error: earningsError } = await supabaseAdmin
      .from('earnings')
      .select('*')
      .eq('payslip_id', payslipId);

    if (earningsError && earningsError.code !== 'PGRST116') {
      console.error('Supabase Error - Fetch Earnings:', earningsError);
    }

    // Fetch deductions from Supabase deductions table
    // Links to payslip via payslip_id foreign key
    const { data: deductions, error: deductionsError } = await supabaseAdmin
      .from('deductions')
      .select('*')
      .eq('payslip_id', payslipId);

    if (deductionsError && deductionsError.code !== 'PGRST116') {
      console.error('Supabase Error - Fetch Deductions:', deductionsError);
    }

    // Build the complete payslip template with all data
    const payslipTemplate: PayslipTemplate = {
      ...payslip,
      earnings: earnings || [],
      deductions: deductions || [],
      calculations: {
        grossEarnings: payslip.gross_earnings,
        totalDeductions: payslip.total_deductions,
        netSalary: payslip.net_salary,
        netSalaryInWords: payslip.net_salary_in_words,
      },
    };

    // Return PDF data (frontend will handle actual PDF generation)
    // PDF generation is done client-side using html2canvas and jsPDF
    return NextResponse.json(
      {
        success: true,
        data: payslipTemplate,
        message: 'Payslip data retrieved for PDF generation',
      } as ApiResponse<any>,
      { status: 200 }
    );
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
