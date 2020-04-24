## Usage

Just require the module

```
const { getProcessByName } = require('get-process-by-name');
```

`await getProcessByName(<executableName>)`:
- executableName (string, required): the name of the executable that you want the info for. Omitting this argument (or supplying an executable name that doesn't have running processes) will return an empty list.

- Returns an `Array` of processes that match the argument

`process` Object structure:
```js
{
    imageName: string, // executable name (usually *.exe)
    pid: number, // process id
    sessionName: string,
    sessionNumber: number,
    memUsage: number, // memory consumption, in bytes
    status: string,
    userName: string,
    cpuTime: string, // CPU time in the format HH:MM:SS, where MM and SS are between 0 and 59 and HH is any unsigned number
    windowTitle: string
}
```

## Todo (pull requests welcome!)

- Add Linux support
- Add Mac support
- Add tests
- Add automatic build server