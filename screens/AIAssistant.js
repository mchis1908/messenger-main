import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Pressable,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { apiCall } from '../api/openAI';
import Features from '../components/features';
import { apiKey } from '../constants';


const App = () => {
  const [result, setResult] = useState('');
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

      apiCall(result.trim(), newMessages).then(res=>{
        console.log('got api data');
        setLoading(false);
        console.log(res)
        if(res.success){
          setMessages([...res.data]);
          setResult('');
          updateScrollView();
          // now play the response to user
          startTextToSpeach(res.data[res.data.length-1]);
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
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical:30 }}>
        <Image source={require('../assets/images/bot.png')} style={{ height: hp(15), width: hp(15) }} />
      </View>

      {messages.length > 0 ? (
      <View style={{ minHeight: hp(50), flex: 1, marginTop: 5, padding: 16 }}>
        <View style={{ backgroundColor: '#f2f2f2', borderRadius: 16 }}>
          <ScrollView ref={scrollViewRef} bounces={false} style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            {messages.map((message, index) => {
            if (message.role === 'assistant') {
              if (message.content.includes('https')) {
                return (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom:16 }}>
                  <View style={{ padding: 8, flex: 1, borderRadius: 16, backgroundColor: '#81e6ad', borderTopRightRadius: 0 }}>
                    <Image source={{ uri: message.content }} style={{ height: wp(50), width: wp(50), borderRadius: 16 }} />
                  </View>
                </View>
                );
              } else {
                return (
                <View key={index} style={{ width: wp(70), backgroundColor: '#81e6ad', padding: 8, borderRadius: 16, borderTopRightRadius: 0, marginBottom:16 }}>
                  <Text style={{ color: '#444', fontSize: wp(4) }}>{message.content}</Text>
                </View>
                );
              }
            } else {
              return (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom:16 }}>
                <View style={{ width: wp(70), backgroundColor: 'white', padding: 8, borderRadius: 16, borderTopLeftRadius: 0 }}>
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
      <Features />
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
