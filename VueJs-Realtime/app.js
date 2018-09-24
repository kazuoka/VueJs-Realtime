//manage database
const database = firebase.database();
const messageRef = database.ref("message");

new Vue({
  el:"#comment",
  data:{
    messageText:'',
    messages:[],
    name:'kazuoka',
    editText:null
  },
  methods:{
    storeMessage:function(){
      messageRef.push({text:this.messageText,name:this.name})
      this.messageText=''
    },
    deleteMessage:function(message){
      //ลบข้อมูล
      messageRef.child(message.id).remove()
    },
    editMessage:function(message){
      //แก้ไขข้อมูล
      this.editText=message
      this.messageText=message.text
    },
    cancelMessage:function(){
      //ยกเลิกข้อมูล
      this.editText=null
      this.messageText=''
    },
    updateMessage:function(){
      //อัพเดทข้อมูล
      messageRef.child(this.editText.id).update({text:this.messageText})
      this.cancelMessage()
    }
  },
  created(){
    //หลังจากเพิ่มข้อมูลเสร็จ หรือ เอาข้อมูลที่มีอยู่ในฐานข้อมูลไปแสดง
    messageRef.on('child_added',snapshot=>{
      //เอาข้อมูลจาก message มาเก็บใน Array
      this.messages.push({...snapshot.val(),id:snapshot.key})
    })
    messageRef.on('child_removed',snapshot=>{
      const deleteText=this.messages.find(message=>message.id == snapshot.key)
      const index=this.messages.indexOf(deleteText)
      this.messages.splice(index,1)
    })
    messageRef.on('child_changed',snapshot=>{
      const updateText=this.messages.find(message=>message.id == snapshot.key)
      updateText.text=snapshot.val().text
    })
  }
})
