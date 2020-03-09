import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';

const device = DeviceInfo.getModel();
console.log(device);
const height = device.includes("X") || device.includes("11") ? hp("7%") : hp("11%")

export default {

    bottomBar: {
        height: hp("7%"),
        backgroundColor: "#0E0E0E",
        borderTopWidth: 0,
    }
};
