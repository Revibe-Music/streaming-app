import branch, { BranchEvent } from 'react-native-branch'

export const setIdentity = (userId) => {
  // This should be the users actual id that will never change
  branch.setIdentity(userId)
}

export const logout = () => {
  // Call this on logout to clear user data
  branch.logout()
}

export const createBranchUniversalObject = async (title, description, image, contentPlatform, contentType, contentId) => {
  // only canonicalIdentifier is required
  var canonicalIdentifier = `${contentPlatform}:${contentType}:${contentId}`
  var options = {
    locallyIndex: true,
    title: title,
    contentDescription: description,
    contentImageUrl: image,
    contentMetadata: {
      customMetadata: {
        contentPlatform: contentPlatform,
        contentType: contentType,
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
  let controlParams = {$desktop_url: 'http://revibe.tech', $ios_url: 'http://revibe.tech'}
  let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
  return url
}

export const showShareSheet = async (branchUniversalObject, campaign, header, body, emailSubject) => {
  // show the share menu for a give branchUniversalObject

  let shareOptions = { messageHeader: header, messageBody: body, emailSubject: emailSubject}
  let linkProperties = {feature: 'share'}
  let controlParams = {$desktop_url: 'http://revibe.tech', $ios_url: 'http://revibe.tech'}
  let {channel, completed, error} = await branchUniversalObject.showShareSheet(shareOptions, linkProperties, controlParams)
  console.log(channel);
}
