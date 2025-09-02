<?php

namespace Database\Seeders;

use App\Models\Control;
use Illuminate\Database\Seeder;

class ControlSeeder extends Seeder
{
    public function run(): void
    {
        if (Control::doesntExist()) {
            $controls = [
                ['name' => 'Assets', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Liabilities', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Equity', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Income',  'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Capital', 'created_at' => now(), 'updated_at' => now()],
            ];

            foreach ($controls as $control) {
                Control::create($control);
            }
        }
    }
}
