import amplitude from 'amplitude-js'
import DeviceInfo from 'react-native-device-info';
import DefaultPreference from 'react-native-default-preference';



export function logEvent(categoryName, eventName, eventData={}) {
  /**
  * Summary: Log Event to amplitude
  *
  * @param {string}   categoryName    options: App, Registration, Login, Onboarding, Tutorial, External Account, Playlist, Library, Search, Share, Feedback,
  * @param {string}   eventName       description of action within category
  */

  categoryName = categoryName.replace(/\b\w/g, l => l.toUpperCase())
  eventName = eventName.replace(/\b\w/g, l => l.toUpperCase())
  // console.log(`Firing Event: ${categoryName} - ${eventName} with properties ${JSON.stringify(eventData)}`);
  amplitude.getInstance().logEventWithTimestamp(`${categoryName} - ${eventName}`, eventData);
}

export async function setUserData(user_id=null) {
  if(!user_id) {
    user_id = await DefaultPreference.get('user_id')
  }
  amplitude.getInstance().setUserId(user_id)

}

export async function setRegistration(user_id=null) {
  setUserData(user_id)
  var identify = new amplitude.Identify().setOnce('Register Date', new Date())
  amplitude.identify(identify); // Send the Identify call
}
