/**
 * Created by rharik on 6/19/15.
 */

module.exports = function(GesEvent) {
    console.log('GesEvent');
    console.log(GesEvent);
    //console.log(GesEvent());
    return class NotificationEvent extends GesEvent {
        constructor(_notificationType, _message, _initialEvent) {
            super();
            this.data = {
                eventName: 'notificationEvent',
                notificationType: _notificationType,
                message: _message,
                initialEvent: _initialEvent
            };
        }
    };
};