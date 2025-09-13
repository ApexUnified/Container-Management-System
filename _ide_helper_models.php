<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $nature_of_account
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Detail> $details
 * @property-read int|null $details_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Subsidary> $subsidaries
 * @property-read int|null $subsidaries_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Control newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Control newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Control query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Control whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Control whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Control whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Control whereNatureOfAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Control whereUpdatedAt($value)
 */
	class Control extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property-read int|null $containers_count
 * @property string $cro_no
 * @property \Illuminate\Support\Carbon $date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockIn> $containers
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cro newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cro newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cro query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cro whereContainersCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cro whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cro whereCroNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cro whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cro whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cro whereUpdatedAt($value)
 */
	class Cro extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockIn> $stock_in
 * @property-read int|null $stock_in_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockOut> $stock_out
 * @property-read int|null $stock_out_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Currency newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Currency newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Currency query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Currency whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Currency whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Currency whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Currency whereUpdatedAt($value)
 */
	class Currency extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $email
 * @property string|null $contact_person
 * @property string|null $address
 * @property string|null $tel_no
 * @property string|null $mobile_no
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance whereContactPerson($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance whereMobileNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance whereTelNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance whereUpdatedAt($value)
 */
	class CustomClearance extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $control_id
 * @property int $subsidary_id
 * @property string $code
 * @property string $account_code
 * @property string $title
 * @property string|null $bank_cash
 * @property string|null $other_details
 * @property string|null $address
 * @property string|null $ntn_no
 * @property string|null $strn_no
 * @property string|null $email
 * @property string|null $mobile_no
 * @property string|null $cnic_no
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $opening_balance
 * @property-read \App\Models\Control $control
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockIn> $stock_custom_clearance
 * @property-read int|null $stock_custom_clearance_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockIn> $stock_freight_forwarder
 * @property-read int|null $stock_freight_forwarder_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockIn> $stock_transporter
 * @property-read int|null $stock_transporter_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockIn> $stock_vendor
 * @property-read int|null $stock_vendor_count
 * @property-read \App\Models\Subsidary $subsidary
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereAccountCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereBankCash($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereCnicNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereControlId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereMobileNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereNtnNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereOpeningBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereOtherDetails($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereStrnNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereSubsidaryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Detail whereUpdatedAt($value)
 */
	class Detail extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property int $unit_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $hs_code
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockIn> $stock_in
 * @property-read int|null $stock_in_count
 * @property-read \App\Models\Unit $unit
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereHsCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereUnitId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereUpdatedAt($value)
 */
	class Product extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property \Illuminate\Support\Carbon $receipt_date
 * @property string|null $receipt_no
 * @property string|null $received_from
 * @property string|null $received_details
 * @property string $received_by
 * @property array<array-key, mixed>|null $bank_details
 * @property array<array-key, mixed>|null $cash_details
 * @property int|null $detail_id
 * @property int|null $currency_id
 * @property string $amount
 * @property string $exchange_rate
 * @property string $total_amount
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Detail|null $account_detail
 * @property-read \App\Models\Currency|null $currency
 * @property-read mixed $formated_bank_details
 * @property-read mixed $formated_cash_details
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereBankDetails($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereCashDetails($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereCurrencyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereExchangeRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereReceiptDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereReceiptNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereReceivedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereReceivedDetails($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereReceivedFrom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ReceiptVoucher whereUpdatedAt($value)
 */
	class ReceiptVoucher extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $email
 * @property string|null $contact_person
 * @property string|null $address
 * @property string|null $tel_no
 * @property string|null $mobile_no
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine whereContactPerson($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine whereMobileNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine whereTelNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine whereUpdatedAt($value)
 */
	class ShippingLine extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $entry_date
 * @property string $container_no
 * @property string|null $vehicle_no
 * @property int|null $cro_id
 * @property string|null $container_size
 * @property string|null $port_location
 * @property int|null $vendor_id
 * @property int|null $product_id
 * @property string $product_weight
 * @property int|null $product_unit_id
 * @property string $product_weight_in_man
 * @property int $product_no_of_bundles
 * @property string $product_rate
 * @property string $product_total_amount
 * @property int|null $transporter_id
 * @property string|null $transporter_rate
 * @property int|null $custom_clearance_id
 * @property string|null $custom_clearance_rate
 * @property int|null $freight_forwarder_id
 * @property string|null $freight_forwarder_rate
 * @property string|null $fc_amount
 * @property string|null $exchange_rate
 * @property int|null $currency_id
 * @property int $all_in_one
 * @property string $total_amount
 * @property string|null $note
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Cro|null $cro
 * @property-read \App\Models\Currency|null $currency
 * @property-read \App\Models\Detail|null $custom_clearance
 * @property-read \App\Models\Detail|null $freight_forwarder
 * @property-read \App\Models\Product|null $product
 * @property-read \App\Models\Detail|null $transporter
 * @property-read \App\Models\Unit|null $unit
 * @property-read \App\Models\Detail|null $vendor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereAllInOne($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereContainerNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereContainerSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereCroId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereCurrencyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereCustomClearanceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereCustomClearanceRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereEntryDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereExchangeRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereFcAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereFreightForwarderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereFreightForwarderRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn wherePortLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereProductNoOfBundles($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereProductRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereProductTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereProductUnitId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereProductWeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereProductWeightInMan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereTransporterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereTransporterRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereVehicleNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockIn whereVendorId($value)
 */
	class StockIn extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property \Illuminate\Support\Carbon $bl_date
 * @property string $bl_no
 * @property int|null $account_id
 * @property string|null $port_name
 * @property int|null $currency_id
 * @property string $exchange_rate
 * @property array<array-key, mixed> $containers
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Detail|null $account
 * @property-read \App\Models\Currency|null $currency
 * @property-read mixed $containers_collection
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut whereBlDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut whereBlNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut whereContainers($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut whereCurrencyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut whereExchangeRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut wherePortName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StockOut whereUpdatedAt($value)
 */
	class StockOut extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $control_id
 * @property string $name
 * @property string $code
 * @property string $account_code
 * @property string|null $account_category
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Control $control
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Detail> $details
 * @property-read int|null $details_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subsidary newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subsidary newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subsidary query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subsidary whereAccountCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subsidary whereAccountCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subsidary whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subsidary whereControlId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subsidary whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subsidary whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subsidary whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subsidary whereUpdatedAt($value)
 */
	class Subsidary extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $email
 * @property string|null $contact_person
 * @property string|null $address
 * @property string|null $tel_no
 * @property string|null $mobile_no
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter whereContactPerson($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter whereMobileNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter whereTelNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter whereUpdatedAt($value)
 */
	class Transporter extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Product> $products
 * @property-read int|null $products_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockIn> $stock_in
 * @property-read int|null $stock_in_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereUpdatedAt($value)
 */
	class Unit extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $email
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $avatar
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $email
 * @property string|null $contact_person
 * @property string|null $address
 * @property string|null $tel_no
 * @property string|null $mobile_no
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor whereContactPerson($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor whereMobileNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor whereTelNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor whereUpdatedAt($value)
 */
	class Vendor extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $payment_date
 * @property string|null $payment_no
 * @property string|null $paid_to
 * @property string|null $payment_details
 * @property string $payment_by
 * @property array<array-key, mixed>|null $bank_details
 * @property array<array-key, mixed>|null $cash_details
 * @property int|null $detail_id
 * @property int|null $currency_id
 * @property string $amount
 * @property string $exchange_rate
 * @property string $total_amount
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Detail|null $account_detail
 * @property-read \App\Models\Currency|null $currency
 * @property-read mixed $formated_bank_details
 * @property-read mixed $formated_cash_details
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher whereBankDetails($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher whereCashDetails($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher whereCurrencyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher whereDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher whereExchangeRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher wherePaidTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher wherePaymentBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher wherePaymentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher wherePaymentDetails($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher wherePaymentNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Voucher whereUpdatedAt($value)
 */
	class Voucher extends \Eloquent {}
}

