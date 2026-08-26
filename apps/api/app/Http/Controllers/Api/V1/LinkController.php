<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateLinkRequest;
use App\Http\Requests\ReorderLinksRequest;
use App\Http\Requests\UpdateLinkRequest;
use App\Http\Resources\LinkResource;
use App\Models\Link;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class LinkController extends Controller
{
    private function profile(Request $r)
    {
        return $r->user()->profile;
    }

    public function index(Request $r): AnonymousResourceCollection
    {
        return LinkResource::collection($this->profile($r)->links()->get());
    }

    public function store(CreateLinkRequest $r): JsonResponse
    {
        $p = $this->profile($r);
        $this->authorize('create', [Link::class, $p]);
        $link = DB::transaction(fn () => $p->links()->create([...$r->validated(), 'position' => (int) $p->links()->max('position') + 1]));

        return (new LinkResource($link))->additional(['message' => 'Link created.'])->response()->setStatusCode(201);
    }

    public function update(UpdateLinkRequest $r, Link $link): LinkResource
    {
        $this->authorize('update', $link);
        $link->update($r->validated());

        return (new LinkResource($link->fresh()))->additional(['message' => 'Link updated.']);
    }

    public function destroy(Request $r, Link $link): JsonResponse
    {
        $this->authorize('delete', $link);
        DB::transaction(function () use ($link) {
            $p = $link->profile;
            $pos = $link->position;
            $link->delete();
            $p->links()->where('position', '>', $pos)->decrement('position');
        });

        return response()->json(['data' => null, 'message' => 'Link deleted.']);
    }

    public function reorder(ReorderLinksRequest $r): AnonymousResourceCollection
    {
        $p = $this->profile($r);
        $this->authorize('reorder', [Link::class, $p]);
        $ids = $r->validated('ordered_link_ids');
        $owned = $p->links()->pluck('id')->all();
        sort($owned);
        $check = $ids;
        sort($check);
        if ($owned !== $check) {
            abort(422, 'ordered_link_ids must contain every current link exactly once.');
        } DB::transaction(function () use ($p, $ids) {
            foreach ($ids as $i => $id) {
                $p->links()->whereKey($id)->update(['position' => 1000000 + $i]);
            } foreach ($ids as $i => $id) {
                $p->links()->whereKey($id)->update(['position' => $i]);
            }
        });

        return LinkResource::collection($p->links()->get())->additional(['message' => 'Links reordered.']);
    }
}
