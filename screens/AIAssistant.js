import React, {useEffect, useRef, useState} from 'react';
import { View, Pressable, TextInput, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { apiCall } from '../api/openAI';
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [result, setResult] = useState('');
  const [feature, setFeature] = useState('gpt');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  const fetchResponse = async ()=>{
    if(result.trim().length>0){
      setLoading(true);
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      setMessages([...newMessages]);

      updateScrollView();

      apiCall(result.trim(), newMessages, feature).then(res=>{
        console.log('got api data');
        setLoading(false);
        console.log(res)
        if(res.success){
          setMessages([...res.data]);
          setResult('');
          updateScrollView();
        }else{
          Alert.alert('Error', res.msg);
        }
      })
    }
  }

  const updateScrollView = ()=>{
    setTimeout(()=>{
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    },200)
  }

  return (
    <SafeAreaView style={{flexDirection: 'column', flex:1, backgroundColor:'#fff'}}>
      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems:'center', marginVertical:30 }}>
      <Image source={feature === 'gpt' ? require('../assets/images/bot.png') : require('../assets/images/dalle.png')} style={{ height: hp(10), width: hp(10) }} />
        <Text style={{ color: feature === 'gpt' ? '#6EE7C8' : '#9E6BFF', fontSize: wp(6), fontWeight: 'bold' }}>{feature==='gpt' ? 'ChatGPT Bot': 'Dall-E Bot'}</Text>
      </View>

      {messages.length > 0 ? (
      <View style={{ minHeight: hp(50), flex: 1, marginTop: 5, padding: 16 }}>
        <View style={{ backgroundColor: '#f2f2f2', borderRadius: 16 }}>
          <ScrollView ref={scrollViewRef} bounces={false} style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            {messages.map((message, index) => {
            if (message.role === 'assistant') {
              if (message.content.includes('https')) {
                return (
                  <View key={index} style={{ width: wp(70), backgroundColor: '#fff', padding: 8, borderRadius: 16, borderTopLeftRadius: 0, marginBottom:16 }}>
                    <Image source={{ uri: message.content }} style={{ height: wp(50), width: wp(50), borderRadius: 16 }} />
                  </View>
                );
              } else {
                return (
                <View key={index} style={{ width: wp(70), backgroundColor: '#fff', padding: 8, borderRadius: 16, borderTopLeftRadius: 0, marginBottom:16 }}>
                  <Text style={{ color: '#444', fontSize: wp(4) }}>{message.content}</Text>
                </View>
                );
              }
            } else {
              return (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom:16 }}>
                <View style={{ width: wp(70), backgroundColor: '#DCF8C6', padding: 8, borderRadius: 16, borderBottomRightRadius: 0 }}>
                  <Text style={{ fontSize: wp(4) }}>{message.content}</Text>
                </View>
              </View>
              );
            }
            })}
          </ScrollView>
        </View>
      </View>
      ) : (
        <ScrollView style={{minHeight: hp(50), bounces: false, showsVerticalScrollIndicator: false , paddingHorizontal:12}}>
          <Text style={{ fontSize: wp(6.5), fontWeight: 'bold', color: '#333' }}>Features</Text>

          <Pressable style={{ backgroundColor: '#6EE7C8', padding: hp(1), borderRadius: 10, marginVertical: hp(1) }} onPress={() => { setFeature('gpt')}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(1) }}>
            <Image source={require('../assets/images/chatgptIcon.png')} style={{ height: hp(4), width: hp(4), borderRadius: hp(2) }} />
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: '#333', marginLeft: wp(2) }}>ChatGPT</Text>
            </View>

            <Text style={{ fontSize: wp(3.8), fontWeight: 'medium', color: '#333' }}>
            ChatGPT can provide you with instant and knowledgeable responses, assist you with creative ideas on a wide range of topics.
            </Text>
          </Pressable>

          <Pressable style={{ backgroundColor: '#9E6BFF', padding: hp(1), borderRadius: 10, marginVertical: hp(1) }} onPress={() => { setFeature('dalle')}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(1) }}>
            <Image source={require('../assets/images/dalleIcon.png')} style={{ height: hp(4), width: hp(4), borderRadius: hp(2) }} />
            <Text style={{ fontSize: wp(4.8), fontWeight: 'bold', color: '#333', marginLeft: wp(2) }}>DALL-E</Text>
            </View>

            <Text style={{ fontSize: wp(3.8), fontWeight: 'medium', color: '#333' }}>
            DALL-E can generate imaginative and diverse images from textual descriptions, expanding the boundaries of visual creativity.
            </Text>
          </Pressable>
        </ScrollView>
      )}

      <View style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#dddddd",
      }}>
        <TextInput value={result} onChangeText={(text)=> setResult(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type Your message..."
        />
        <Pressable onPress={()=> fetchResponse()}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginLeft: 8,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default App;
