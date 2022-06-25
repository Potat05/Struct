
# JavaScript Struct

C++ like Struct for JavaScript.  
For file data structures.  



## Comparison
C++  
```cpp
struct Custom {
    unsigned char header[3];
    unsigned int data;
};

Custom structure = { { 0x48, 0x69, 0x21 }, 12345 };

char* bytes = reinterpret_cast<char*>(&structure);
```

JavaScript  
```javascript
import { Types } from "./struct.js";

const structure = new Types.Struct('Custom', [
    new Types.Uint8Array('header', [0x48, 0x69, 0x21]);
    new Types.Uint32('data', 12345);
]);

const bytes = file.bytes;
```



## Types

Types / Members
```javascript
new Types.Uint8(name, number);
new Types.Uint16(name, number);
new Types.Uint32(name, number);
new Types.Uint64(name, BigInt|number);
new Types.Float32(name, number);
new Types.Float64(name, number);

new Types.Uint8Array(name, length|ArrayLike);
new Types.Uint16Array(name, length|ArrayLike);
new Types.Uint32Array(name, length|ArrayLike);
new Types.Uint64Array(name, length|ArrayLike);
new Types.Float32Array(name, length|ArrayLike);
new Types.Float64Array(name, length|ArrayLike);

// Each character is one byte
new Types.ASCII(name, string, maxLength);

/* Because UTF-8 might have characters bigger than one byte
   they will get removed to fit into the maxLength */
new Types.UTF8(name, string, maxLength);

// Members is an array of Types/Members
new Types.Struct(name, Members[]);
```



## Usage/Examples

Import the library  
```javascript
import { Types } from "./struct.js";
```

Creating a Struct  
```javascript
const structure = new Types.Struct('myStruct', [
    // Add members directly through the constructor
    new Types.Uint32Array('version', [1, 0])
]);

// Or add them through .addMember
structure.addMember(new Types.Uint32('len', 12));
```

Get Struct bytes array or url  
```javascript
const data = structure.bytes; // Returns Uint8Array
const url = structure.url; // Returns data URL for downloading
```

Access Struct values or members  
```javascript
structure.addMember(new Types.Uint32('infoLen', 0));
structure.addMember(new Types.UTF8('info', 'Random Information.'));

// Access members (name to access member value, $name to access member)
structure.infoLen = structure.$info.size;
```

Supports Structs inside of Structs  
```javascript
structure.addMember(new Types.Struct('structInsideStruct', [
    new Types.UTF8('string', 'Cool!')
]));

// Access Struct values inside of Struct
structure.$structInsideStruct.string = 'Hot!';
```

Other stuffs  
```javascript
// If struct has a member
const hasMember = structure.hasMember(name);

// Remove a member
const removed = structure.removeMember(name);

// Insert a member
const index = structure.insertMember(member, insertName, after);
// Or just name to move member
structure.insertMember(name, insertName, after);
// Set after if you want to insert the member after

// Get a members byte offset
const offset = structure.getOffset(name);

// Cannot add 2 Members with same name
structure.addMember(new Values.Float32('value'));
structure.addMember(new Values.Float32('value')); // Error.
structure.addMember(new Values.Float32('$value')); // Also error because $ is already being used for accessing the member
```

Configuration
```javascript
// Inside of 'struct.js' there's some options you can change.

const VALUE_ACCESS = ''; // Used to access member values inside Structs: structure.memberName
const MEMBER_ACCESS = '$'; // Used to access members inside Structs: structure.$memberName
```



## Authors

- [@Potat05](https://github.com/Potat05)  


