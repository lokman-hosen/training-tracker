<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('employees')->insert([
            [
                'name' => 'Rahim Uddin',
                'phone' => '01710000001',
                'email' => 'rahim@example.com',
                'id_number' => 'EMP-1001',
                'image' => null,
                'designation' => 'Software Engineer',
                'department' => 'IT',
                'joining_date' => '2022-01-15',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Karim Hossain',
                'phone' => '01710000002',
                'email' => 'karim@example.com',
                'id_number' => 'EMP-1002',
                'image' => null,
                'designation' => 'HR Executive',
                'department' => 'Human Resources',
                'joining_date' => '2021-06-10',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nusrat Jahan',
                'phone' => '01710000003',
                'email' => 'nusrat@example.com',
                'id_number' => 'EMP-1003',
                'image' => null,
                'designation' => 'Accounts Officer',
                'department' => 'Finance',
                'joining_date' => '2023-03-01',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tanvir Ahmed',
                'phone' => '01710000004',
                'email' => 'tanvir@example.com',
                'id_number' => 'EMP-1004',
                'image' => null,
                'designation' => 'Project Manager',
                'department' => 'Operations',
                'joining_date' => '2020-11-20',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Farhana Akter',
                'phone' => '01710000005',
                'email' => 'farhana@example.com',
                'id_number' => 'EMP-1005',
                'image' => null,
                'designation' => 'UI/UX Designer',
                'department' => 'Design',
                'joining_date' => '2022-09-05',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
