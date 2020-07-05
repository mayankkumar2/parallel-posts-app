import {Dimensions} from 'react-native';

export function GetWidth (ComponentWidth, ScreenDesignWidth) {
    let Width = Dimensions.get('window').width;
    return (ComponentWidth/ScreenDesignWidth) * Width;
}

export function GetHeight (ComponentHeight, ScreenDesignHeight) {
    let Height = Dimensions.get('window').height;
    return (ComponentHeight/ScreenDesignHeight) * Height;
}

export const LoginStatus = p => (p ? '#5859ED' : '#D0D0D6');
