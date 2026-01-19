<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Super Admin',
                'phone' => '01700000001',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('12345678'),
                'role' => 'super-admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin',
                'phone' => '01700000002',
                'email' => 'admin@example.com',
                'password' => Hash::make('12345678'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
