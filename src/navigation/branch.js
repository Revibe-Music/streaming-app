import branch, { BranchEvent } from 'react-native-branch'
import DefaultPreference from 'react-native-default-preference';


export const setIdentity = async (user_id=null) => {
  // This should be the users actual id that will never change
  if(!user_id) {
    user_id = await DefaultPreference.get('user_id')
  }
  if(typeof user_id == "number") {
    user_id = user_id.toString()
  }
  branch.setIdentity(user_id)
}

export const logout = () => {
  // Call this on logout to clear user data
  branch.logout()
}

export const createBranchUniversalObject = async (title, description, image, contentPlatform, contentType, contentId) => {
  // only canonicalIdentifier is required
  var canonicalIdentifier = `${contentPlatform.toLowerCase()}:${contentType.toLowerCase()}:${contentId}`
  var options = {
    locallyIndex: true,
    title: title,
    contentDescription: description,
    contentImageUrl: image,
    tags: ["auto", "revibe-music"],
    contentMetadata: {
      customMetadata: {
        contentPlatform: contentPlatform.toLowerCase(),
        contentType: contentType.toLowerCase(),
        contentId: contentId
      }
    }
  }
  var branchUniversalObject = await branch.createBranchUniversalObject(canonicalIdentifier, options)
  branchUniversalObject.logEvent(BranchEvent.ViewItem)
  return branchUniversalObject
}

export const generateLink = async (branchUniversalObject, channel, campaign) => {
  // generate a link for a give branchUniversalObject

  let linkProperties = {feature: 'share', channel: channel}
  let controlParams = {$desktop_url: 'http://revibe.tech'}
  let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
  return url
}

export const showShareSheet = async (branchUniversalObject, campaign, header, body, emailSubject) => {
  // show the share menu for a give branchUniversalObject

  let shareOptions = { messageHeader: header, messageBody: body, emailSubject: emailSubject}
  let linkProperties = {feature: 'share'}
  let controlParams = {$desktop_url: 'http://revibe.tech'}
  let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
  if(channel) {
    branchUniversalObject.logEvent(BranchEvent.Share)
  }
  console.log(channel);
}
