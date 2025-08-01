<?php

namespace App\Http\Controllers;

use App\Models\CustomClearance;
use App\Models\Product;
use App\Models\ShippingLine;
use App\Models\Transporter;
use App\Models\Unit;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {

        $total_users = User::count();
        $total_vendors = Vendor::count();
        $total_units = Unit::count();
        $total_shipping_lines = ShippingLine::count();
        $total_transporters = Transporter::count();
        $total_products = Product::count();
        $total_custom_clearances = CustomClearance::count();

        return Inertia::render('Dashboard',
            compact(
                'total_users',
                'total_vendors',
                'total_units',
                'total_shipping_lines',
                'total_transporters',
                'total_products',
                'total_custom_clearances'
            )
        );
    }
}
