{{-- resources/views/pdf/employee-list.blade.php --}}
    <!DOCTYPE html>
<html>
<head>
    <title>Employee Training Report</title>
    <style>
        @page {
            margin: 50px 25px;
            font-family: Arial, sans-serif;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
        }

        .header h1 {
            color: #1e40af;
            margin: 0;
            font-size: 24px;
        }

        .header .subtitle {
            color: #6b7280;
            margin-top: 5px;
            font-size: 14px;
        }

        .report-info {
            margin-bottom: 20px;
            background: #f8fafc;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #3b82f6;
        }

        .filters {
            margin-bottom: 20px;
            font-size: 11px;
            color: #6b7280;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th {
            background-color: #3b82f6;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 11px;
            border: 1px solid #ddd;
        }

        td {
            padding: 8px 10px;
            border: 1px solid #ddd;
            font-size: 10px;
        }

        tr:nth-child(even) {
            background-color: #f8fafc;
        }

        .summary {
            margin-top: 30px;
            padding: 15px;
            background: #f0f9ff;
            border-radius: 5px;
            border-left: 4px solid #0ea5e9;
        }

        .summary h3 {
            color: #0369a1;
            margin-top: 0;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }

        .summary-item {
            text-align: center;
            padding: 10px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .summary-value {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
        }

        .summary-label {
            font-size: 11px;
            color: #6b7280;
            margin-top: 5px;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }

        .page-break {
            page-break-before: always;
        }

        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
        }

        .completed {
            background-color: #d1fae5;
            color: #065f46;
        }

        .in-progress {
            background-color: #fef3c7;
            color: #92400e;
        }

        .not-started {
            background-color: #f3f4f6;
            color: #374151;
        }
    </style>
</head>
<body>
<div class="header">
    <h1>Employee Training Report</h1>
    <div class="subtitle">Government Office Training Management System</div>
    <div style="margin-top: 10px; font-size: 11px; color: #6b7280;">
        Generated on: {{ $report_date }}
    </div>
</div>

<div class="report-info">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <strong>Report Type:</strong> Employee Training Summary
            @if(!empty($filters['start_date']) || !empty($filters['end_date']))
                <br><strong>Date Range:</strong>
                {{ $filters['start_date'] ?? 'Start' }} to {{ $filters['end_date'] ?? 'End' }}
            @endif
        </div>
        <div style="text-align: right;">
            <strong>Total Employees:</strong> {{ $total_employees }}
        </div>
    </div>
</div>

@if(!empty($filters['employee_ids']) || !empty($filters['training_ids']))
    <div class="filters">
        <strong>Applied Filters:</strong>
        @if(!empty($filters['employee_ids']))
            <span style="margin-left: 10px;">Employees: {{ count($filters['employee_ids']) }} selected</span>
        @endif
        @if(!empty($filters['training_ids']))
            <span style="margin-left: 10px;">Trainings: {{ count($filters['training_ids']) }} selected</span>
        @endif
    </div>
@endif

<table>
    <thead>
    <tr>
        <th>SL</th>
        <th>Employee ID</th>
        <th>Employee Name</th>
        <th>Contact</th>
        <th>Total Trainings</th>
        <th>Completed</th>
        <th>Training Hours</th>
        <th>Status</th>
    </tr>
    </thead>
    <tbody>
    @foreach($employees as $index => $employee)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $employee->id_number }}</td>
            <td>{{ $employee->name }}</td>
            <td>
                {{ $employee->phone }}<br>
                <small>{{ $employee->email }}</small>
            </td>
            <td style="text-align: center;">{{ $employee->total_trainings_count }}</td>
            <td style="text-align: center;">{{ $employee->completed_trainings_count }}</td>
            <td style="text-align: center;">{{ number_format($employee->total_training_hours, 1) }}</td>
            <td style="text-align: center;">
                @if($employee->completed_trainings_count == $employee->total_trainings_count)
                    <span class="status-badge completed">Completed All</span>
                @elseif($employee->completed_trainings_count > 0)
                    <span class="status-badge in-progress">In Progress</span>
                @else
                    <span class="status-badge not-started">Not Started</span>
                @endif
            </td>
        </tr>
    @endforeach
    </tbody>
</table>

<div class="summary">
    <h3>Report Summary</h3>
    <div class="summary-grid">
        <div class="summary-item">
            <div class="summary-value">{{ $total_employees }}</div>
            <div class="summary-label">Total Employees</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">{{ $total_completed_trainings }}</div>
            <div class="summary-label">Completed Trainings</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">{{ number_format($total_training_hours, 1) }}</div>
            <div class="summary-label">Total Training Hours</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">
                @php
                    $avgHours = $total_employees > 0 ? $total_training_hours / $total_employees : 0;
                @endphp
                {{ number_format($avgHours, 1) }}
            </div>
            <div class="summary-label">Avg Hours/Employee</div>
        </div>
    </div>
</div>

<div class="footer">
    This report was generated by Government Office Training Management System.<br>
    Report ID: TR-{{ date('YmdHis') }} | Page 1 of 1
</div>
</body>
</html>
