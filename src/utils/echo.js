import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: 'n82dtcebxl6x7bpfhshp',
    wsHost: 'bradly-spumescent-keisha.ngrok-free.dev', 
    forceTLS: true, 
    disableStats: true,
    enabledTransports: ['ws', 'wss']
});

export default echo;