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

class TranslucidUpdated implements ShouldBroadcast
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
        Log::debug('TranslucidUpdated event broadcasted for model: ' . get_class($this->model) . ' with ID: ' . $this->model->id);
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
            'model' => get_class($this->model),
            'id' => $this->model->id,
            'data' => $this->model->toArray(),
            'event' => 'updated',
        ];
    }

    public function broadcastAs(): string
    {
        return 'translucid.updated.' .$this->model->getTable(). '.' . $this->model->id;
    }
}
