// import Navigation from "../components/Navigation";
// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import Voice from '@react-native-community/voice';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import { apiCall } from 'api/openAI';
// import Features from '../components/features';
// import Tts from 'react-native-tts';


// const App = () => {
//   const [result, setResult] = useState('');
//   const [recording, setRecording] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [speaking, setSpeaking] = useState(false);
//   const scrollViewRef = useRef();

//   const speechStartHandler = e => {
//     console.log('speech start event', e);
//   };
//   const speechEndHandler = e => {
//     setRecording(false);
//     console.log('speech stop event', e);
//   };
//   const speechResultsHandler = e => {
//     console.log('speech event: ',e);
//     const text = e.value[0];
//     setResult(text);
    
//   };

//   const speechErrorHandler = e=>{
//     console.log('speech error: ',e);
//   }

  
//   const startRecording = async () => {
//     setRecording(true);
//     Tts.stop(); 
//     try {
//       await Voice.start('en-GB'); // en-US

//     } catch (error) {
//       console.log('error', error);
//     }
//   };
//   const stopRecording = async () => {
    
//     try {
//       await Voice.stop();
//       setRecording(false);
//       fetchResponse();
//     } catch (error) {
//       console.log('error', error);
//     }
//   };
//   const clear = () => {
//     Tts.stop();
//     setSpeaking(false);
//     setLoading(false);
//     setMessages([]);
//   };

//   const fetchResponse = async ()=>{
//     if(result.trim().length>0){
//       setLoading(true);
//       let newMessages = [...messages];
//       newMessages.push({role: 'user', content: result.trim()});
//       setMessages([...newMessages]);

//       // scroll to the bottom of the view
//       updateScrollView();

//       // fetching response from chatGPT with our prompt and old messages
//       apiCall(result.trim(), newMessages).then(res=>{
//         console.log('got api data');
//         setLoading(false);
//         if(res.success){
//           setMessages([...res.data]);
//           setResult('');
//           updateScrollView();

//           // now play the response to user
//           startTextToSpeach(res.data[res.data.length-1]);
          
//         }else{
//           Alert.alert('Error', res.msg);
//         }
        
//       })
//     }
//   }



//   const updateScrollView = ()=>{
//     setTimeout(()=>{
//       scrollViewRef?.current?.scrollToEnd({ animated: true });
//     },200)
//   }

//   const startTextToSpeach = message=>{
//     if(!message.content.includes('https')){
//       setSpeaking(true);
//       // playing response with the voice id and voice speed
//       Tts.speak(message.content, {
//         iosVoiceId: 'com.Apple.ttsbundle.Samantha-compact',
//         rate: 0.5,
//       });
//     }
//   }
  

//   const stopSpeaking = ()=>{
//     Tts.stop();
//     setSpeaking(false);
//   }

//   useEffect(() => {

//     // voice handler events
//     Voice.onSpeechStart = speechStartHandler;
//     Voice.onSpeechEnd = speechEndHandler;
//     Voice.onSpeechResults = speechResultsHandler;
//     Voice.onSpeechError = speechErrorHandler;
    
//     // text to speech events
//     // Tts.setDefaultLanguage('en-IE');
//     Tts.addEventListener('tts-start', event => console.log('start', event));
//     Tts.addEventListener('tts-finish', event => {console.log('finish', event); setSpeaking(false)});
//     Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    
    
//     return () => {
//       // destroy the voice instance after component unmounts
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);


//   return (
//     <View style={{flex:1, backgroundColor:'#fff'}}>
//         {/* <StatusBar barStyle="dark-content" /> */}
//         <SafeAreaView style={{flexDirection: 'column'}}>
//             {/* bot icon */}
//             <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical:30 }}>
//                 <Image
//                 source={require('../assets/images/bot.png')}
//                 style={{ height: hp(15), width: hp(15) }}
//                 />
//             </View>

//             {/* features || message history */}
//             {messages.length > 0 ? (
//                 <View style={{ flex: 1, marginTop: 5 }}>
//                 <Text style={{ color: 'gray', fontWeight: 'bold', marginLeft: 1, fontSize: wp(5) }}>
//                     Assistant
//                 </Text>

//                 <View style={{ height: hp(58), backgroundColor: '#f2f2f2', borderRadius: 16, padding: 16 }}>
//                     <ScrollView
//                     ref={scrollViewRef}
//                     bounces={false}
//                     style={{ paddingVertical: 16 }}
//                     showsVerticalScrollIndicator={false}
//                     >
//                     {messages.map((message, index) => {
//                         if (message.role === 'assistant') {
//                         if (message.content.includes('https')) {
//                             // result is an ai image
//                             return (
//                             <View key={index} style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
//                                 <View style={{ padding: 8, flex: 1, borderRadius: 16, backgroundColor: '#81e6ad', borderTopRightRadius: 0 }}>
//                                 <Image
//                                     source={{ uri: message.content }}
//                                     style={{ height: wp(60), width: wp(60), borderRadius: 16 }}
//                                 />
//                                 </View>
//                             </View>
//                             );
//                         } else {
//                             // chat gpt response
//                             return (
//                             <View key={index} style={{ width: wp(70), backgroundColor: '#81e6ad', padding: 8, borderRadius: 16, borderTopRightRadius: 0 }}>
//                                 <Text style={{ color: '#444', fontSize: wp(4) }}>{message.content}</Text>
//                             </View>
//                             );
//                         }
//                         } else {
//                         // user input text
//                         return (
//                             <View key={index} style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
//                             <View style={{ width: wp(70), backgroundColor: 'white', padding: 8, borderRadius: 16, borderTopLeftRadius: 0 }}>
//                                 <Text style={{ fontSize: wp(4) }}>{message.content}</Text>
//                             </View>
//                             </View>
//                         );
//                         }
//                     })}
//                     </ScrollView>
//                 </View>
//                 </View>
//             ) : (
//                 <Features />
//             )}

//             {/* recording, clear and stop buttons */}
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                 {loading ? (
//                 <Image
//                     source={require('../assets/images/loading.gif')}
//                     style={{ width: hp(10), height: hp(10) }}
//                 />
//                 ) : recording ? (
//                 <TouchableOpacity onPress={stopRecording}>
//                     {/* recording stop button */}
//                     <Image
//                     source={require('../assets/images/voiceLoading.gif')}
//                     style={{ width: hp(10), height: hp(10), borderRadius: hp(10) / 2 }}
//                     />
//                 </TouchableOpacity>
//                 ) : (
//                 <TouchableOpacity onPress={startRecording}>
//                     {/* recording start button */}
//                     <Image
//                     source={require('../assets/images/recordingIcon.png')}
//                     style={{ width: hp(10), height: hp(10), borderRadius: hp(10) / 2 }}
//                     />
//                 </TouchableOpacity>
//                 )}

//                 {messages.length > 0 && (
//                 <TouchableOpacity onPress={clear} style={{ backgroundColor: '#ccc', borderRadius: 16, padding: 8, position: 'absolute', right: 10 }}>
//                     <Text style={{ color: 'white', fontWeight: 'bold' }}>Clear</Text>
//                 </TouchableOpacity>
//                 )}

//                 {speaking && (
//                 <TouchableOpacity onPress={stopSpeaking} style={{ backgroundColor: 'red', borderRadius: 16, padding: 8, position: 'absolute', left: 10 }}>
//                     <Text style={{ color: 'white', fontWeight: 'bold' }}>Stop</Text>
//                 </TouchableOpacity>
//                 )}
//             </View>
//             </SafeAreaView>
      
//         <View style={{position:'absolute', bottom:0, width:'100%'}}>
//             <Navigation/>
//         </View>
//     </View>
//   );
// };

// export default App;
