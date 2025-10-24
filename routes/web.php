<?php

use App\Http\Controllers\AccountLedgerController;
use App\Http\Controllers\AccountSettingController;
use App\Http\Controllers\BlReportController;
use App\Http\Controllers\ChartOfAccountController;
use App\Http\Controllers\ControlController;
use App\Http\Controllers\CroController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\CustomClearanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\DubaiExpenseController;
use App\Http\Controllers\DubaiExpenseSettingController;
use App\Http\Controllers\DubaiExpenseTransactionController;
use App\Http\Controllers\ExtraChargesExpenseController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseReportController;
use App\Http\Controllers\ReceiptVoucherController;
use App\Http\Controllers\ShippingLineController;
use App\Http\Controllers\StockInController;
use App\Http\Controllers\StockInReportController;
use App\Http\Controllers\StockOutController;
use App\Http\Controllers\SubsidaryController;
use App\Http\Controllers\TransporterController;
use App\Http\Controllers\TrialBalanceController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VoucherController;
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

        // Currency Routes
        Route::resource('/currency', CurrencyController::class)->except(['show', 'edit', 'create']);
        Route::delete('/currency-destroy-by-selectetion', [CurrencyController::class, 'destroyBySelection'])->name('currency.destroybyselection');

        // Account Routes Group
        Route::prefix('/accounts')->name('accounts.')->group(function () {

            // Account Control Routes
            Route::resource('/controls', ControlController::class)->except(['show', 'edit', 'create']);
            Route::delete('/controls-destroy-by-selectetion', [ControlController::class, 'destroyBySelection'])->name('controls.destroybyselection');

            // Account Subsidary Routes
            Route::resource('/subsidaries', SubsidaryController::class)->except(['show', 'edit', 'create']);
            Route::delete('/subsidaries-destroy-by-selectetion', [SubsidaryController::class, 'destroyBySelection'])->name('subsidaries.destroybyselection');

            // Account Detail Routes
            Route::resource('/details', DetailController::class)->except(['show', 'edit', 'create']);
            Route::get('/details-get-subsidary-by-control/{control_id}', [DetailController::class, 'getSubsidaryByControl'])->name('details.getsubsidarybycontrol');
            Route::delete('/details-destroy-by-selectetion', [DetailController::class, 'destroyBySelection'])->name('details.destroybyselection');

        });

        // Account Setting
        Route::get('/account-setting', [AccountSettingController::class, 'index'])->name('account-setting.index');
        Route::post('/account-setting', [AccountSettingController::class, 'save'])->name('account-setting.save');

        // Dubai Expense Routes
        Route::resource('/dubai-expenses', DubaiExpenseController::class)->except(['show', 'edit', 'create']);
        Route::delete('/dubai-expenses-destroy-by-selectetion', [DubaiExpenseController::class, 'destroyBySelection'])->name('dubai-expenses.destroybyselection');

        // Dubai Expense Setting Routes
        Route::get('/dubai-expense-setting', [DubaiExpenseSettingController::class, 'index'])->name('dubai-expense-setting.index');
        Route::post('/dubai-expense-setting', [DubaiExpenseSettingController::class, 'save'])->name('dubai-expense-setting.save');

        // Extra Charges Expense Routes
        Route::resource('/extra-charges-expenses', ExtraChargesExpenseController::class)->except(['show', 'edit', 'create']);
        Route::delete('/extra-charges-destroy-by-selectetion', [ExtraChargesExpenseController::class, 'destroyBySelection'])->name('extra-charges-expenses.destroybyselection');
    });

    // Transactions Route Group
    Route::prefix('/transactions')->name('transactions.')->group(function () {

        Route::resource('/cros', CroController::class)->except(['show', 'edit', 'create']);
        Route::delete('/cros-destroy-by-selectetion', [CroController::class, 'destroyBySelection'])->name('cros.destroybyselection');

        Route::resource('/stock-in', StockInController::class)->except(['show', 'edit', 'create']);
        Route::delete('/stock-in-destroy-by-selectetion', [StockInController::class, 'destroyBySelection'])->name('stock-in.destroybyselection');

        Route::resource('/stock-out', StockOutController::class)->except(['show', 'edit', 'create']);
        Route::post('/stock-out-generate-invoice', [StockOutController::class, 'generateInvoice'])->name('stock-out.generate-invoice');
        Route::delete('/stock-out-destroy-by-selectetion', [StockOutController::class, 'destroyBySelection'])->name('stock-out.destroybyselection');

        Route::resource('/vouchers', VoucherController::class)->except(['show', 'edit', 'create']);
        Route::get('/vouchers-get-account-details-by-type/{type}', [VoucherController::class, 'getAccountDetailsByType'])->name('vouchers.getaccountdetailsbytype');
        Route::delete('/vouchers-destroy-by-selectetion', [VoucherController::class, 'destroyBySelection'])->name('vouchers.destroybyselection');

        Route::resource('/receipt-vouchers', ReceiptVoucherController::class)->except(['show', 'edit', 'create']);
        Route::delete('/receipt-vouchers-destroy-by-selectetion', [ReceiptVoucherController::class, 'destroyBySelection'])->name('receipt-vouchers.destroybyselection');

        // Dubai Expense Transaction Routes
        Route::resource('/dubai-expense-transactions', DubaiExpenseTransactionController::class)->except(['show', 'edit', 'create', 'update']);

        Route::post('/dubai-expense-transactions-find-containers', [DubaiExpenseTransactionController::class, 'findContainers'])->name('dubai-expense-transactions.find-containers');

        Route::delete('/dubai-expense-transactions-destroy-by-selectetion', [DubaiExpenseTransactionController::class, 'destroyBySelection'])->name('dubai-expense-transactions.destroybyselection');
    });

    // Report Routes Group
    Route::prefix('/reports')->name('reports.')->group(function () {

        Route::get('/account-ledgers', [AccountLedgerController::class, 'index'])->name('account-ledgers.index');
        Route::post('/account-ledgers-generate-report', [AccountLedgerController::class, 'generateReport'])->name('account-ledgers.generate-report');

        Route::get('/trial-balances', [TrialBalanceController::class, 'index'])->name('trial-balances.index');
        Route::post('/trial-balances-generate-report', [TrialBalanceController::class, 'generateReport'])->name('trial-balances.generate-report');

        Route::get('/chart-of-accounts', ChartOfAccountController::class)->name('chart-of-accounts.index');

        Route::get('/purchase-report', [PurchaseReportController::class, 'index'])->name('purchase-report.index');
        Route::post('/purchase-report', [PurchaseReportController::class, 'generateReport'])->name('purchase-report.generate-report');

        Route::get('/stockin-report', [StockInReportController::class, 'index'])->name('stockin-report.index');
        Route::post('/stockin-report', [StockInReportController::class, 'generateReport'])->name('stockin-report.generate-report');

        Route::get('/bl-report', [BlReportController::class, 'index'])->name('bl-report.index');
        Route::post('/bl-report', [BlReportController::class, 'generateReport'])->name('bl-report.generate-report');

    });

    // User Routes
    Route::resource('/users', UserController::class)->except(['show', 'edit', 'create']);
    Route::delete('/users-destroy-by-selectetion', [UserController::class, 'destroyBySelection'])->name('users.destroybyselection');

});

require __DIR__.'/auth.php';
