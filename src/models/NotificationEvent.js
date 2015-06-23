/**
 * Created by rharik on 6/19/15.
 */

var gesEvent = global.container.gesEvent;

module.exports = class NotificationEvent extends gesEvent{
    constructor(_notificationType, _message, _initialEvent){
        super('notificationEvent');
        this.data = {
            eventName: 'notificationEvent',
            notificationType: _notificationType,
            message: _message,
            initialEvent: _initialEvent
        };
    }
};