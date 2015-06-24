/**
 * Created by rharik on 6/19/15.
 */

module.exports = function(gesEvent) {
    return class NotificationEvent extends gesEvent {
        constructor(_notificationType, _message, _initialEvent) {
            super('notificationEvent');
            this.data = {
                eventName: 'notificationEvent',
                notificationType: _notificationType,
                message: _message,
                initialEvent: _initialEvent
            };
        }
    };
};