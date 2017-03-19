'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const async = require('async');
const gcs = require('@google-cloud/storage')();
// const blobUtil = require('blob-util');
const fs = require('fs');
// const spawn = require('child-process-promise').spawn;
admin.initializeApp(functions.config().firebase);

exports.discussionUploader = functions.database
  .ref('/v1/interfaceGroup/discussions/{interfaceId}/{ui}/discussion/{discussionId}/nodes/{nodeId}/refers/{referId}/boxes/{boxId}').onWrite(event => {
    const box = event.data.val()
    console.log(box.thumbnail);
    var thumbnail = box.thumbnail.replace(/^data:image\/png;base64,/, "");
    var filename = '/tmp/tempFile-' + event.params.boxId + '.png'
    if (/^data:image\/png;base64,/.test(box.thumbnail)) {
      return fs.writeFile(filename, thumbnail, 'base64', function(err) {
        if (err) {
          console.log('write file error')
          return console.error(err)
        } else {
          const bucket = gcs.bucket('project-korero-system.appspot.com');
          return bucket.upload(filename, {
            destination: 'v1/interfaceGroup/thumbnail/thumbnail-' + event.params.boxId + '.png',
            gzip: true,
            public: true
          }).then(function(data) {
            var file = data[0];
            return event.data.ref.child('thumbnail').set(file.metadata.mediaLink);
            // console.log(data[0])

          }).catch(function(err) {
            console.log('create and upload error')
            console.error(err);

          })
        }
      })
    } else {
      return;
    }
  })

exports.thumbnailChecker = functions.storage.object().onChange(event => {
  const object = event.data;
  console.log(object.name);
  return ;
})

// exports.moderator = functions.database
//   .ref('/v1/interfaceGroup/activity/{activityId}').onWrite(event => {
//     const data = event.data.val();
//     var ref = data.ref;
//     // console.log(ref)

//     admin.database().ref(ref).once('value', function(snapshot) {
//       // console.log(snapshot.val())
//       if (snapshot.val()) {
//         var obj = snapshot.val();
//         var boxes = [];
//         for (var i in obj.nodes) {
//           for (var j in obj.nodes[i].refers) {
//             for (var k in obj.nodes[i].refers[j].boxes) {
//               boxes.push({
//                 i: i,
//                 j: j,
//                 k: k,
//                 thumbnail: obj.nodes[i].refers[j].boxes[k].thumbnail
//               })
//             }
//           }
//         }

//         // console.log(boxes);

//         async.each(boxes, function(box, cb) {
//           // console.log(/^data:image\/png;base64,/.test(box.thumbnail))
//           if (/^data:image\//.test(box.thumbnail)) {
//             // blobUtil.dataURLToBlob(box.thumbnail).then(function(blob) {

//             // })
//             var thumbnail = box.thumbnail.replace(/^data:image\/png;base64,/, "");
//             var filename = '/tmp/tempFile-' + box.i + '-' + box.j + '-' + box.k + '.png'
//             fs.writeFile(filename, thumbnail, 'base64', function(err) {
//               if (err) {
//                 console.log('write file error')
//                 console.error(err)
//               } else {
//                 const bucket = gcs.bucket('project-korero-system.appspot.com');
//                 bucket.upload(filename, {
//                   destination: '/v1/interfaceGroup/thumbnail/thumbnail-' + box.i + '-' + box.j + '-' + box.k + '.png',
//                   gzip: true
//                 }).then(function(data) {
//                   var file = data[0];
//                   console.log(data)
//                   cb();
//                 }).catch(function(err) {
//                   console.log('create and upload error')
//                   console.error(err);
//                   cb();
//                 })

//                 console.log(filename)

//               }
//             })


//             // var task = admin.storage().ref(ref + '/thumbnail/' + box.k).putString(box.thumbnail, 'data_url');
//             // task.on('state_changed', function(s) {}, function(err) {
//             //   console.error(err);
//             //   cb();
//             // }, function() {
//             //   obj.nodes[box.i].refers[box.j].boxes[box.k].thumbnail = task.snapshot.downloadURL;
//             //   cb();
//             // })
//           } else {
//             cb();
//           }
//         }, function(err) {
//           if (err) {
//             console.log('last error')
//             console.error(err)
//           }

//           // console.log(obj);

//           admin.database().ref(ref).set(obj).then(function() {
//             console.log('complete')
//           }).catch(function(error) {
//             console.log('saving error')
//             console.error(error);
//           })

//         })
//       }
//     });
//     // console.log(data);
//     // if (message && !message.sanitized) {
//     //   // Retrieved the message values.
//     //   console.log('Retrieved message content: ', message);

//     //   // Run moderation checks on on the message and moderate if needed.
//     //   const moderatedMessage = moderateMessage(message.text);

//     //   // Update the Firebase DB with checked message.
//     //   console.log('Message has been moderated. Saving to DB: ', moderatedMessage);
//     //   return event.data.adminRef.update({
//     //     text: moderatedMessage,
//     //     sanitized: true,
//     //     moderated: message.text !== moderatedMessage
//     //   });
//     // }
//   });
