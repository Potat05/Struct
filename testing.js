

// RANDOM TESTING




import { Types } from "./struct.js";





/**
 * Random Struct test
 */
function SIMPLE_Test() {
    const Test = new Types.Struct('TestStruct', [
        new Types.Uint8('value1', 0x7F),
        new Types.Uint16('value2', 0x925A),
        new Types.Uint32('value3', 123123123),
        new Types.Uint16Array('value4', [420, 69]),
        new Types.Uint8Array('value5', 4),
        new Types.UTF8('value6', '⑳§', 4) // Will only output first character (3 bytes) because second character gets cut off by maxLength
    ]);

    Test.addMember(new Types.Uint32('testOffset'));

    Test.addMember(new Types.UTF8('testString', 'Hello, World!'));

    // Struct in struct!
    Test.addMember(new Types.Struct('StructInStruct', [
        new Types.Uint8('value1', 0)
    ]));
    
    // Get & set members values.
    Test.testOffset = Test.size;


    // Set member struct members value by adding '_'
    Test.$StructInStruct.value1 = 127;
    // get like this it will use byte array
    Test.StructInStruct; // (Setting will error)


    // Example for adding a string with length.
    Test.addMember(new Types.Uint32('randomStringLength'));
    Test.addMember(new Types.UTF8('randomString', (Math.random() + 1).toString(36).substring(Math.ceil(Math.random()*10))));
    Test.randomStringLength = Test.$randomString.size;

    Test.addMember(new Types.Uint64('big', 0xFFFFFFFFFFFFFFFFn));
    Test.addMember(new Types.Uint64Array('bigArr', [
        0xFFFFFFFFFFFF,
        0xFFFFFFFFFFFF
    ]));

    Test.insertMember('bigArr', 'big');

    return Test;
}




/**
 * VTF file testing
 * https://developer.valvesoftware.com/wiki/Valve_Texture_Format
 * https://developer.valvesoftware.com/wiki/$keyvalues
 */
function VTF_Test() {

    const resource_count = 1;

    const VTF = new Types.Struct('VTF_File', [
        new Types.ASCII('signature', 'VTF\0'),
        new Types.Uint32Array('version', [7, 4]),
        new Types.Uint32('headerSize', 80 + resource_count*8),
        new Types.Uint16('width', 0),
        new Types.Uint16('height', 0),
        new Types.Uint32('flags', 0),
        new Types.Uint16('frames', 1),
        new Types.Uint16('firstFrame', 0),
        new Types.Uint8Array('padding0', 4),
        new Types.Float32Array('reflectivity', [ 0, 0, 0 ]),
        new Types.Uint8Array('padding1', 4),
        new Types.Float32('bumpmapScale', 1),
        new Types.Uint32('highResImageFormat', 0),
        new Types.Uint8('mipmapCount', 0),
        new Types.Uint32('lowResImageFormat', 0),
        new Types.Uint8('lowResImageWidth', 0),
        new Types.Uint8('lowResImageHeight', 0),
        new Types.Uint16('depth', 1),
        new Types.Uint8Array('padding2', 3),
        new Types.Uint32('numResources', 1),
        new Types.Uint8Array('padding3', 8),
        new Types.Struct('resource_KVD', [
            new Types.ASCII('tag', 'KVD'),
            new Types.Uint8('flags', 0),
            new Types.Uint32('offset', 0)
        ])
    ]);


    // Set the KVD resource
    VTF.$resource_KVD.offset = VTF.size;
    const KVD_content = `Info
{
    "Creator" "Potato"
    "Date" "${new Date()}"
    "Description" "This is a test for Structs."
}`;
    VTF.addMember(new Types.Uint32('KVD_length', KVD_content.length));
    VTF.addMember(new Types.ASCII('KVD_data', KVD_content));



    const a = document.createElement('a');
    a.download = 'converted.vtf';
    a.innerText = 'VTF File';
    a.href = VTF.url;

    document.body.appendChild(a);

    console.log('VTF Size', VTF.size);

    return VTF;
}

function SET_Test() {

    const str = 'Hello, World!';

    const test = new Types.Struct('string', [
        new Types.Uint32('length', str.length),
        new Types.ASCII('string', str),
        new Types.Float64('PI', Math.PI)
    ]);

    const bytes = test.bytes;

    test.bytes = new Uint8Array(test.size);

    test.setBytes(bytes, {
        interpreter: (struct, bytes, offset, member, prevMember) => {
            if(member.name == 'string') {
                const len = prevMember.value;
                member.value = bytes.slice(offset, offset+len).reduce((str, byte) => str + String.fromCharCode(byte), '');
                return len;
            }
            return -1;
        }
    });

    return test;
}

// console.log('Test1', SIMPLE_Test());
// console.log('VTF Test', VTF_Test());
console.log('Set test', SET_Test());
