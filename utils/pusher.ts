import Pusher from 'pusher';

// Initialize Pusher
const pusher = new Pusher({
  appId:  "1872455",
  key: "d70648a990c9399479e1",
  secret: "414c6a46bf065de11053",
  cluster: "eu",
  useTLS: true
});



// Function to trigger an event
export async function notifyUserFetched(user) {
  pusher.trigger('my-channel', 'user-fetched', {
    user: user,
  });
}
