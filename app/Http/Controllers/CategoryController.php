<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::query();

        $request->validate(['name' => 'nullable|string']);

        if ($request->filled('search')) {
            $categories->where('name', 'like', '%'.$request->search.'%');
        }

        $categories = $categories->paginate(5);

        $categories->getCollection()->transform(function ($category) {
            $category->added_at = Carbon::parse($category->created_at)->format('g:i A Y-M-D');

            return $category;
        });

        $request->filled('search') ? $search = $request->search : $search = null;

        return Inertia::render('Categories/index', compact('categories', 'search'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated_req = $request->validate([
            'name' => 'required',
        ]);

        if (Category::create($validated_req)) {
            return redirect()->route('category.index')->with('success', 'Category Created Succesfully');
        } else {
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        if (empty($id)) {
            return redirect()->route('category.index')->with('error', 'No Category Found');
        }

        $category = Category::find($id);

        if (empty($category)) {
            return redirect()->route('category.index')->with('error', 'No Category Found');
        }

        return Inertia::render('Categories/edit', compact('category'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        if (empty($id)) {
            return redirect()->route('category.index')->with('error', 'No Category Found');
        }

        $validated_req = $request->validate([
            'name' => 'required',
        ]);

        $category = Category::find($id);

        if (empty($category)) {
            return redirect()->route('category.index')->with('error', 'No Category Found');
        }

        if ($category->update($validated_req)) {
            return redirect()->route('category.index')->with('success', 'Category Updated Succesfully');
        } else {
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (empty($id)) {
            return redirect()->route('category.index')->withErrors(request()->all())->with('error', 'No Category Found');
        }

        $category = Category::find($id);

        if (empty($category)) {
            return redirect()->route('category.index')->with('error', 'No Category Found');
        }

        if ($category->delete()) {
            return redirect()->route('category.index')->with('success', 'Category Deleted Succesfully');
        } else {
            return redirect()->back()->with('error', 'Something went wrong');
        }
    }

    public function deleteBySelection(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:categories,id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->with('error', $validator->errors()->first());
        }

        $ids = $request->ids;

        Category::whereIn('id', $ids)->delete();

        return back()->with('success', 'Seletced Categories Deleted Succesfully');
    }
}
