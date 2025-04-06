import { Platform } from 'react-native';
import { SessionStatus } from '@/src/types/pomodoro';
import notifee, { AlarmType, AndroidImportance, AndroidNotificationSetting, TriggerType } from '@notifee/react-native';

// Channel ID constants
const TIMER_CHANNEL_ID = 'pomodoro-timer';
const SPACED_REPETITION_CHANNEL_ID = 'spaced-repetition';

// Schedule a notification for when the timer will end
export async function scheduleTimerEndNotification(status: SessionStatus, endTime: number): Promise<string> {
  let title, body;

  switch (status) {
    case SessionStatus.Work:
      title = 'Work Session Complete';
      body = 'Time for a break!';
      break;
    case SessionStatus.Break:
      title = 'Break Complete';
      body = 'Lets get back to work!';
      break;
    case SessionStatus.LongBreak:
      title = 'Long Break Complete';
      body = 'Lets get back to work!';
      break;
  }

  try {
    // Generate a random ID
    const notificationId = Math.random().toString(36).substring(2, 15);

    // Schedule the notification using Notifee
    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title,
        body,
        android: {
          channelId: TIMER_CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          sound: 'bell',
          lightUpScreen: true,
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: endTime,
        alarmManager: {
          type: AlarmType.SET_ALARM_CLOCK,
        },
      },
    );
    return notificationId;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return '';
  }
}

// Schedule a reminder for spaced repetition review
export async function scheduleReviewReminder(
  reviewId: string,
  title: string,
  date: Date,
  timeString: string = "09:00"
): Promise<string> {
  try {
    // Parse the time string (format: "HH:MM")
    const [hours, minutes] = timeString.split(":").map(Number);

    // Set the time on the specified date
    const reminderDate = new Date(date);
    reminderDate.setHours(hours, minutes, 0, 0);

    // Generate a notification ID
    const notificationId = `review-${reviewId}`;

    // Schedule the notification using Notifee
    await notifee.createTriggerNotification(
      {
        id: notificationId,
        title: 'Time to review',
        body: `Don't forget to review "${title}" today`,
        android: {
          channelId: SPACED_REPETITION_CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          sound: 'default',
          lightUpScreen: true,
        },
        data: {
          type: 'spaced-repetition',
          itemId: reviewId,
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: reminderDate.getTime(),
        alarmManager: {
          type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE,
        },
      },
    );

    return notificationId;
  } catch (error) {
    console.error('Failed to schedule review reminder:', error);
    return '';
  }
}

// Cancel a scheduled notification
export async function cancelScheduledNotification(notificationId: string | null): Promise<void> {
  if (!notificationId) return;

  try {
    await notifee.cancelNotification(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

export async function intializeNotificationService() {
  const permission = await notifee.requestPermission();

  if (permission.android.alarm == AndroidNotificationSetting.ENABLED) {
    console.log('Exact alarm permission is enabled');
  } else {
    await notifee.openAlarmPermissionSettings();
  }

  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: TIMER_CHANNEL_ID,
      name: 'Pomodoro Timer',
      importance: AndroidImportance.HIGH,
      sound: 'bell',
    });

    // Create a channel for spaced repetition reminders
    await notifee.createChannel({
      id: SPACED_REPETITION_CHANNEL_ID,
      name: 'Study Reminders',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  }
}