{{-- resources/views/pdf/employee-detail.blade.php --}}
    <!DOCTYPE html>
<html>
<head>
    <title>Employee Training Detail Report - {{ $employee->name }}</title>
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

        .employee-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
            border-left: 4px solid #3b82f6;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }

        .info-item {
            padding: 10px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .info-label {
            font-size: 10px;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
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

        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
        }

        .attended {
            background-color: #d1fae5;
            color: #065f46;
        }

        .not-attended {
            background-color: #fee2e2;
            color: #991b1b;
        }

        .completed {
            background-color: #dbeafe;
            color: #1e40af;
        }

        .incomplete {
            background-color: #fef3c7;
            color: #92400e;
        }

        .summary {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 5px;
            margin-top: 30px;
            border-left: 4px solid #0ea5e9;
        }

        .summary h3 {
            color: #0369a1;
            margin-top: 0;
            margin-bottom: 15px;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }

        .summary-item {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
        }

        .summary-label {
            font-size: 12px;
            color: #6b7280;
            margin-top: 5px;
        }

        .total-row {
            background-color: #e0f2fe !important;
            font-weight: bold;
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
    </style>
</head>
<body>
<div class="header">
    <h1>Officer/staff Training Detail Report</h1>
    <div class="subtitle">{{ $employee->name }} ({{ $employee->id_number ?? $employee->phone }})</div>
    <div style="margin-top: 10px; font-size: 11px; color: #6b7280;">
        Generated on: {{ $report_date }}
    </div>
</div>

<div class="employee-info">
    <h3 style="margin-top: 0; color: #374151; font-size: 16px;">Officer Information</h3>
    <div class="info-grid">
        @if($employee->id_number)
            <div class="info-item">
                <div class="info-label">Officer/staff ID</div>
                <div class="info-value">{{ $employee->id_number}}</div>
            </div>
        @endif
        <div class="info-item">
            <div class="info-label">Department</div>
            <div class="info-value">{{ $employee->department ?? 'N/A' }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Designation</div>
            <div class="info-value">{{ $employee->designation }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Joining Date</div>
            <div class="info-value">{{ $employee->joining_date ? date('d M, Y', strtotime($employee->joining_date)) : 'N/A' }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">{{ $employee->email ?? 'N/A' }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Phone</div>
            <div class="info-value">{{ $employee->phone }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Trainings</div>
            <div class="info-value">{{ $total_trainings }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Report ID</div>
            <div class="info-value">ETR-{{ $employee->id }}-{{ date('Ymd') }}</div>
        </div>
    </div>
</div>

<h3 style="color: #374151; font-size: 16px; margin-bottom: 15px;">Training History</h3>

<table>
    <thead>
    <tr>
        <th>SL</th>
        <th>Training Name</th>
        <th>Topic</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Duration</th>
        <th>Attended</th>
        <th>Completed</th>
        <th>Grade</th>
    </tr>
    </thead>
    <tbody>
    @foreach($employee->trainings as $index => $training)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $training->name }}</td>
            <td>{{ $training->topic }}</td>
            <td>{{ date('d M, Y h:i A', strtotime($training->start_date)) }}</td>
            <td>{{ date('d M, Y h:i A', strtotime($training->end_date)) }}</td>
            <td style="text-align: center;">{{ abs(number_format($training->training_hours, 1)) }} hrs</td>
            <td style="text-align: center;">
                    <span class="status-badge {{ $training->pivot->attended ? 'attended' : 'not-attended' }}">
                        {{ $training->pivot->attended ? 'Yes' : 'No' }}
                    </span>
            </td>
            <td style="text-align: center;">
                    <span class="status-badge {{ $training->pivot->completed ? 'completed' : 'incomplete' }}">
                        {{ $training->pivot->completed ? 'Yes' : 'No' }}
                    </span>
            </td>
            <td style="text-align: center;">
                @if($training->pivot->grade)
                    <strong>{{ $training->pivot->grade }}</strong>
                @else
                    -
                @endif
            </td>
        </tr>
    @endforeach

    @if($employee->trainings->count() > 0)
        <tr class="total-row">
            <td colspan="5" style="text-align: right; font-size: 12px;"><strong>Total Completed Training Hours:</strong></td>
            <td style="text-align: center; font-size: 12px;">
                <strong>{{ abs(number_format($totalHours, 1)) }} hrs</strong>
            </td>
            <td colspan="3" style="text-align: center; font-size: 12px;">
                <strong>Summary: {{ $attended_trainings }} attended / {{ $completed_trainings }} completed</strong>
            </td>
        </tr>
    @endif
    </tbody>
</table>

@if($employee->trainings->count() > 0)
    <div class="summary">
        <h3>Training Summary</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-value">{{ $total_trainings }}</div>
                <div class="summary-label">Total Trainings</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">{{ $attended_trainings }}</div>
                <div class="summary-label">Attended</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">{{ $completed_trainings }}</div>
                <div class="summary-label">Completed</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">{{ abs(number_format($totalHours, 1)) }}</div>
                <div class="summary-label">Total Hours</div>
            </div>
        </div>
    </div>
@endif

<div class="footer">
    This report was generated by Office Employee/Staff Training Management System.<br>
    Employee ID: {{ $employee->id_number ?? $employee->phone }} | Report ID: ETR-{{ $employee->id }}-{{ date('YmdHis') }}
</div>
</body>
</html>
