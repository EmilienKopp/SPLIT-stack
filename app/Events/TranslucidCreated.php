<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TranslucidCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The model instance.
     *
     * @var Model
     */
    public $model;

    /**
     * Create a new event instance.
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('translucid'),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'type'  => $this->model->getTable(),
            'model' => get_class($this->model),
            'id'    => $this->model->getKey(),
            'op'    => 'created',
            'data'  => $this->model->toArray(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'translucid.created.' . $this->model->getTable();
    }
}
