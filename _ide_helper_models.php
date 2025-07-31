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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category query()
 */
	class Category extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property string|null $email
 * @property string|null $contact_person
 * @property string|null $address
 * @property string|null $tel_no
 * @property string|null $mobile_no
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $added_at
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CustomClearance whereUuid($value)
 */
	class CustomClearance extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property int $unit_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $added_at
 * @property-read \App\Models\Unit $unit
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereUnitId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Product whereUuid($value)
 */
	class Product extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property string|null $email
 * @property string|null $contact_person
 * @property string|null $address
 * @property string|null $tel_no
 * @property string|null $mobile_no
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $added_at
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ShippingLine whereUuid($value)
 */
	class ShippingLine extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property string|null $email
 * @property string|null $contact_person
 * @property string|null $address
 * @property string|null $tel_no
 * @property string|null $mobile_no
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $added_at
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transporter whereUuid($value)
 */
	class Transporter extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $added_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Product> $products
 * @property-read int|null $products_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereUuid($value)
 */
	class Unit extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $added_at
 * @property-read mixed $avatar
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUuid($value)
 */
	class User extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property string|null $email
 * @property string|null $contact_person
 * @property string|null $address
 * @property string|null $tel_no
 * @property string|null $mobile_no
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $added_at
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vendor whereUuid($value)
 */
	class Vendor extends \Eloquent {}
}

