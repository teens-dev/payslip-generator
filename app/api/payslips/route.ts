// API Route: POST /api/payslips
// Creates a new payslip with employee earnings and deductions
// Supabase Integration:
// - Stores payslip data in 'payslips' table
// - Stores earnings in 'earnings' table
// - Stores deductions in 'deductions' table
// - Calculates totals and stores calculations

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { PayslipData, ApiResponse } from '@/types';
import { numberToWords } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const payslipData: PayslipData = await request.json();

    // Validate required fields
    if (!payslipData.company || !payslipData.employee || !payslipData.payPeriod) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: company, employee, or payPeriod',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Calculate totals
    const grossEarnings = payslipData.earnings.reduce((sum, item) => sum + item.amount, 0);
    const totalDeductions = payslipData.deductions.reduce((sum, item) => sum + item.amount, 0);
    const netSalary = grossEarnings - totalDeductions;
    const netSalaryInWords = numberToWords(netSalary);

    // Generate unique payslip ID
    const timestamp = Date.now();
    const payslipId = `PSL-${payslipData.employee.employeeId}-${Date.now()}`;

    // Insert into Supabase payslips table
    // The 'payslips' table structure includes:
    // - id (UUID)
    // - payslip_id (unique string identifier)
    // - company_id (foreign key)
    // - employee_id (foreign key)
    // - pay_period_year, pay_period_month, paid_days, loss_of_pay_days
    // - gross_earnings, total_deductions, net_salary
    // - net_salary_in_words
    // - bank_details (JSONB)
    // - created_at, updated_at

    const { data: payslip, error: payslipError } = await supabaseAdmin
      .from('payslips')
      .insert([
        {
          payslip_id: payslipId,
          company_info: payslipData.company,
          employee_info: payslipData.employee,
          bank_details: payslipData.bankDetails || null,
          pay_period_year: payslipData.payPeriod.year,
          pay_period_month: payslipData.payPeriod.month,
          paid_days: payslipData.payPeriod.paidDays,
          loss_of_pay_days: payslipData.payPeriod.lossOfPayDays,
          pay_date: payslipData.payPeriod.payDate,
          gross_earnings: grossEarnings,
          total_deductions: totalDeductions,
          net_salary: netSalary,
          net_salary_in_words: netSalaryInWords,
        },
      ])
      .select()
      .single();

    if (payslipError) {
      console.error('Supabase Error - Insert Payslip:', payslipError);
      return NextResponse.json(
        { success: false, error: 'Failed to create payslip' } as ApiResponse<null>,
        { status: 500 }
      );
    }

    // Insert earnings into Supabase earnings table
    // The 'earnings' table structure includes:
    // - id (UUID)
    // - payslip_id (foreign key to payslips table)
    // - name (string - earning component name)
    // - amount (numeric)
    // - created_at

    if (payslipData.earnings.length > 0) {
      const earningsRecords = payslipData.earnings.map((earning) => ({
        payslip_id: payslip.id,
        name: earning.name,
        amount: earning.amount,
      }));

      const { error: earningsError } = await supabaseAdmin
        .from('earnings')
        .insert(earningsRecords);

      if (earningsError) {
        console.error('Supabase Error - Insert Earnings:', earningsError);
        // Delete the payslip if earnings insertion fails
        await supabaseAdmin.from('payslips').delete().eq('id', payslip.id);
        return NextResponse.json(
          { success: false, error: 'Failed to save earnings data' } as ApiResponse<null>,
          { status: 500 }
        );
      }
    }

    // Insert deductions into Supabase deductions table
    // The 'deductions' table structure includes:
    // - id (UUID)
    // - payslip_id (foreign key to payslips table)
    // - name (string - deduction component name)
    // - amount (numeric)
    // - created_at

    if (payslipData.deductions.length > 0) {
      const deductionsRecords = payslipData.deductions.map((deduction) => ({
        payslip_id: payslip.id,
        name: deduction.name,
        amount: deduction.amount,
      }));

      const { error: deductionsError } = await supabaseAdmin
        .from('deductions')
        .insert(deductionsRecords);

      if (deductionsError) {
        console.error('Supabase Error - Insert Deductions:', deductionsError);
        // Delete the payslip and earnings if deductions insertion fails
        await supabaseAdmin.from('payslips').delete().eq('id', payslip.id);
        return NextResponse.json(
          { success: false, error: 'Failed to save deductions data' } as ApiResponse<null>,
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: payslip.id,
          payslipId,
          calculations: {
            grossEarnings,
            totalDeductions,
            netSalary,
            netSalaryInWords,
          },
        },
        message: 'Payslip created successfully',
      } as ApiResponse<any>,
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all payslips
export async function GET(request: NextRequest) {
  try {
    const { data: payslips, error } = await supabaseAdmin
      .from('payslips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error - Fetch Payslips:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch payslips' } as ApiResponse<null>,
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: payslips } as ApiResponse<any>,
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
