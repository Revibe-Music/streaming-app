import amplitude from 'amplitude-js'
import DeviceInfo from 'react-native-device-info';



export function logEvent(categoryName, eventName, eventData={}) {
  /**
  * Summary: Log Event to amplitude
  *
  * @param {string}   categoryName    options: App, Registration, Login, Onboarding, Tutorial, External Account, Playlist, Library, Search, Share, Feedback,
  * @param {string}   eventName       description of action within category
  */

  categoryName = categoryName.replace(/\b\w/g, l => l.toUpperCase())
  eventName = eventName.replace(/\b\w/g, l => l.toUpperCase())
  console.log(`Firing Event: ${categoryName} - ${eventName} with properties ${JSON.stringify(eventData)}`);
  // amplitude.getInstance().logEventWithTimestamp(`${category} - ${eventName}`, eventData);
}

export async function setUserData(userId) {
  const deviceId = DeviceInfo.getUniqueId();
  const firstInstallTime = await DeviceInfo.getFirstInstallTime();

  amplitude.getInstance().setUserId(userId)
  amplitude.getInstance().setDeviceId(deviceId)     // get unique device id. Might not need to implement

  var identify = new amplitude.Identify()
  identify.setOnce('Register Date', new Date())
  identify.setOnce('First Install Date', new Date(firstInstallTime))
  amplitude.identify(identify); // Send the Identify call
}



//// SESSION PROPERTIES ////
export function App_Launch() {
  amplitude.getInstance().logEventWithTimestamp('App - Launched');
}
export function App_EnterForeground() {
  amplitude.getInstance().logEventWithTimestamp('App - Enter Foreground');
}
export function App_EnterBackground() {
  amplitude.getInstance().logEventWithTimestamp('App - Enter Background');
}

// export function Navigate_Tab(tabName) {
//   amplitude.getInstance().logEventWithTimestamp('Enter Background');
// }
// export function Navigate_Page(pageName) {
//
// }

//// AUTH EVENTS ////
export function Registration_AccountInfoComplete() {
  amplitude.getInstance().logEventWithTimestamp('Registration - Account Info Complete');
}
export function Registration_Submitted() {
  amplitude.getInstance().logEventWithTimestamp('Registration - Submitted');
}
export function Registration_Success(userId, username) {
  amplitude.getInstance().logEventWithTimestamp('Registration - Success');
  amplitude.getInstance().setUserId(userId)
  amplitude.getInstance().setDeviceId()     // get unique device id. Might not need to implement
  var identify = new amplitude.Identify().setOnce('Register Date', new Date()).set('username', username)
  amplitude.identify(identify); // Send the Identify call
}
export function Registration_Failed() {
  amplitude.getInstance().logEventWithTimestamp('Registration - Failed');
}

export function Login_Submitted() {
  amplitude.getInstance().logEventWithTimestamp('Login - Submitted');
}
export function Login_Success() {
  amplitude.getInstance().logEventWithTimestamp('Login - Success');
  var identify = new amplitude.Identify().set('Last Login', new Date())
  amplitude.getInstance().identify(identify);
}
export function Login_Failed() {
  amplitude.getInstance().logEventWithTimestamp('Login - Failed');
}

//// TUTORIAL EVENTS ///
export function Tutorial_Started() {
  amplitude.getInstance().logEventWithTimestamp('Tutorial - Started');
}
export function Tutorial_Skip(lastSeenPage) {
  amplitude.getInstance().logEventWithTimestamp('Tutorial - Started', {"last seen page": lastVisitedPage});
}
export function Tutorial_Complete() {
  amplitude.getInstance().logEventWithTimestamp('Tutorial - Completed');
}



//// EXTERNAL ACCOUNT EVENTS ///
export function Settings_ButtonClicked() {

}

export function ExternalAccount_Connect_Clicked() {

}
export function ExternalAccount_Connect_Success() {

}
export function ExternalAccount_Connect_Failed() {

}

export function ExternalAccount_Disconnect_Clicked() {

}
export function ExternalAccount_Disconnect_Success() {

}
export function ExternalAccount_Disconnect_Failed() {

}


export function StartNewPlayQueue() {

}

export function Playlist_Open() {

}
export function Playlist_Create() {

}
export function Playlist_Delete() {

}
export function Playlist_AddSong() {

}
export function Playlist_DeleteSong() {

}

export function Library_AddSong() {

}
export function Library_DeleteSong() {

}
export function Library_Search() {

}


export function Search_Executed() {

}
export function Search_ResultSelected() {

}
export function Search_TabSwitched() {

}

export function Play_Song() {   // this is a stream

}

export function InviteFriend() {

}
export function GiveFeedback() {

}

export function Onboarding_Begin() {

}
export function Onboarding_Skip() {

}
export function Onboarding_Complete() {

}

export function Browse() {

}
