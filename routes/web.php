<?php

use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\CustomClearanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShippingLineController;
use App\Http\Controllers\StockInController;
use App\Http\Controllers\TransporterController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', 'dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    //    Setups Routes Group
    Route::group(['prefix' => 'setups', 'as' => 'setups.'], function () {

        // Unit Routes
        Route::resource('/units', UnitController::class)->except(['show', 'create', 'edit']);
        Route::delete('/units-destroy-by-selectetion', [UnitController::class, 'destroyBySelection'])->name('units.destroybyselection');

        // Shipping Line Routes
        Route::resource('/shipping-lines', ShippingLineController::class)->except(['show', 'edit', 'create']);
        Route::delete('/shipping-lines-destroy-by-selectetion', [ShippingLineController::class, 'destroyBySelection'])->name('shipping-lines.destroybyselection');

        // Vendor Routes
        Route::resource('/vendors', VendorController::class)->except(['show', 'edit', 'create']);
        Route::delete('/vendors-destroy-by-selectetion', [VendorController::class, 'destroyBySelection'])->name('vendors.destroybyselection');

        // Transporter Routes
        Route::resource('/transporters', TransporterController::class)->except(['show', 'edit', 'create']);
        Route::delete('/transporters-destroy-by-selectetion', [TransporterController::class, 'destroyBySelection'])->name('transporters.destroybyselection');

        // Custom Clearance Routes
        Route::resource('/custom-clearances', CustomClearanceController::class)->except(['show', 'edit', 'create']);
        Route::delete('/custom-clearances-destroy-by-selectetion', [CustomClearanceController::class, 'destroyBySelection'])->name('custom-clearances.destroybyselection');

        // Custom Clearance Routes
        Route::resource('/products', ProductController::class)->except(['show', 'edit', 'create']);
        Route::delete('/products-destroy-by-selectetion', [ProductController::class, 'destroyBySelection'])->name('products.destroybyselection');

    });

    Route::prefix('/transactions')->name('transactions.')->group(function () {
        Route::resource('/stock-ins', StockInController::class)->except(['show', 'edit', 'create']);
        Route::delete('/stock-ins-destroy-by-selectetion', [StockInController::class, 'destroyBySelection'])->name('stock-ins.destroybyselection');
    });

    // User Routes
    Route::resource('/users', UserController::class)->except(['show', 'edit', 'create']);
    Route::delete('/users-destroy-by-selectetion', [UserController::class, 'destroyBySelection'])->name('users.destroybyselection');

    // Currency Routes
    Route::resource('/currencies', CurrencyController::class)->except(['show', 'edit', 'create']);
    Route::delete('/currencies-destroy-by-selectetion', [CurrencyController::class, 'destroyBySelection'])->name('currencies.destroybyselection');
});

require __DIR__.'/auth.php';
