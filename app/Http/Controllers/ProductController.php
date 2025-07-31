<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Unit;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('unit')->latest()->paginate();

        $units = Unit::latest()->get();

        return Inertia::render('Setups/Products/index', compact('products', 'units'));
    }

    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => ['required', 'string'],
            'unit_id' => ['required', 'integer', 'exists:units,id'],
        ]);

        try {
            if (Product::create($validated_req)) {
                return back()->with('success', 'Product Created Successfully');
            }

            throw new Exception('Something Went Wrong While Creating Product');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        if (empty($id)) {
            throw ValidationException::withMessages([
                'server' => 'Product ID is Missing',
            ]);
        }

        $validated_req = $request->validate([
            'name' => ['required', 'string'],
            'unit_id' => ['required', 'integer', 'exists:units,id'],
        ]);

        try {
            $product = Product::find($id);

            if (empty($product)) {
                throw new Exception('Product Not Found');
            }

            if ($product->update($validated_req)) {
                return back()->with('success', 'Product Updated Successfully');
            }

            throw new Exception('Something Went Wrong While Updating Product');
        } catch (Exception $e) {
            throw ValidationException::withMessages([
                'server' => $e->getMessage(),
            ]);
        }
    }

    public function destroy(string $id)
    {
        try {
            if (empty($id)) {
                throw new Exception('Product ID is Missing');
            }

            $product = Product::find($id);

            if (empty($product)) {
                throw new Exception('Product Not Found');
            }

            if ($product->delete()) {
                return back()->with('success', 'Product Deleted Successfully');
            }

            throw new Exception('Something Went Wrong While Deleting Product');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function destroyBySelection(Request $request)
    {
        try {
            $ids = $request->array('ids');
            if (blank($ids)) {
                throw new Exception('Product ID is Missing');
            }

            $deleted = Product::destroy($ids);

            if ($deleted !== count($ids)) {
                throw new Exception('Something Went Wrong While Deleting Product');
            }

            return back()->with('success', 'Product Deleted Successfully');

        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
