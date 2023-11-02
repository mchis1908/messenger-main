import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default function Features() {
  return (
    <ScrollView style={{minHeight: hp(62), bounces: false, showsVerticalScrollIndicator: false , paddingHorizontal:12}}>
        <Text style={{ fontSize: wp(6.5), fontWeight: 'bold', color: '#333' }}>Features</Text>

        <View style={{ backgroundColor: '#6EE7C8', padding: hp(1), borderRadius: 10, marginVertical: hp(1) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(1) }}>
            <Image source={require('../assets/images/chatgptIcon.png')} style={{ height: hp(4), width: hp(4), borderRadius: hp(2) }} />
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: '#333', marginLeft: wp(2) }}>ChatGPT</Text>
            </View>

            <Text style={{ fontSize: wp(3.8), fontWeight: 'medium', color: '#333' }}>
            ChatGPT can provide you with instant and knowledgeable responses, assist you with creative ideas on a wide range of topics.
            </Text>
        </View>

        <View style={{ backgroundColor: '#9E6BFF', padding: hp(1), borderRadius: 10, marginVertical: hp(1) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(1) }}>
            <Image source={require('../assets/images/dalleIcon.png')} style={{ height: hp(4), width: hp(4), borderRadius: hp(2) }} />
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: '#333', marginLeft: wp(2) }}>DALL-E</Text>
            </View>

            <Text style={{ fontSize: wp(3.8), fontWeight: 'medium', color: '#333' }}>
            DALL-E can generate imaginative and diverse images from textual descriptions, expanding the boundaries of visual creativity.
            </Text>
        </View>

        <View style={{ backgroundColor: '#1E90FF', padding: hp(1), borderRadius: 10, marginVertical: hp(1) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(1) }}>
            <Image source={require('../assets/images/smartaiIcon.png')} style={{ height: hp(4), width: hp(4), borderRadius: hp(2) }} />
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: '#333', marginLeft: wp(2) }}>Smart AI</Text>
            </View>

            <Text style={{ fontSize: wp(3.8), fontWeight: 'medium', color: '#333' }}>
            A powerful voice assistant with the abilities of ChatGPT and DALL-E, providing you the best of both worlds.
            </Text>
        </View>
        </ScrollView>
  )
}