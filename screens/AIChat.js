import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function AIChat() {
    const navigation = useNavigation();
  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', backgroundColor: 'white' }}>
        <SafeAreaView style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', backgroundColor: 'white',marginHorizontal: 16 }}>
            <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: wp(10), textAlign: 'center', fontWeight: 'bold', color: 'gray' }}>
                    Jarvis
                </Text>
                <Text style={{ fontSize: wp(4), textAlign: 'center', fontWeight: '500', color: 'gray' }}>
                    The future is here, powered by AI.
                </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Image
                source={require('../assets/images/welcome.png')}
                style={{ height: wp(50), width: wp(50) }}
                />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('AIAssistant')} style={{ backgroundColor: 'rgb(46, 204, 113)', marginHorizontal: 5, padding: 16, borderRadius: 16 }}>
                <Text style={{ fontSize: wp(6), textAlign: 'center', fontWeight: 'bold', color: 'white' }}>
                Get Started
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
        <View style={{position:'absolute', bottom:0, width:'100%'}}>
        </View>
    </View>
    
  )
}