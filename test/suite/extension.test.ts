//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as path from 'path';



import * as luacheck from '../../src/luacheck';
const LuaVM = require('../../src/lua.vm');
let L = new LuaVM.Lua.State();
let checker = new luacheck.luacheck(L)

// Defines a Mocha test suite to group tests of similar kind together
suite("luacheck Tests", () => {

    const PROJECT_ROOT = path.join(__dirname, '../../../');
    const TEST_DATA_ROOT = path.join(PROJECT_ROOT, 'third_party/luacheck/spec/');

    const testSampleFile = (fileName: string, expectedReports: luacheck.report[]) => {
        test(fileName, () => {
            const CHECK_DATA = path.join(TEST_DATA_ROOT, 'samples', fileName);
            let reports = checker.check(CHECK_DATA);

            assert.deepEqual(reports, expectedReports)
        });
    }


    testSampleFile('bad_code.lua', [
        {"code":"211","column":16,"end_column":21,"line":3,"message":"unused function 'helper'","name":"helper","func":true},
        {"code":"212","column":23,"end_column":25,"line":3,"message":"unused variable length argument","name":"..."},
        {"code":"111","column":10,"end_column":16,"line":7,"message":"setting non-standard global variable 'embrace'","name":"embrace"},
        {"code":"412","column":10,"end_column":12,"line":8,"message":"variable 'opt' was previously defined as an argument on line 7","name":"opt","prev_line":7},
        {"code":"113","column":11,"end_column":16,"line":9,"message":"accessing undefined variable 'hepler'","name":"hepler"}
    ])


    testSampleFile("bad_flow.lua", [
        {"code":"542","column":28,"end_column":31,"line":1,"message":"empty if branch"},
        {"code":"541","column":4,"end_column":5,"line":6,"message":"empty do..end block"},
        {"code":"532","column":10,"end_column":17,"line":12,"message":"right side of assignment has less values than left side expects"},
        {"code":"531","column":10,"end_column":23,"line":16,"message":"right side of assignment has more values than left side expects"},
        {"code":"511","column":7,"end_column":37,"line":21,"message":"unreachable code"},
        {"code":"512","column":1,"end_column":13,"line":25,"message":"loop is executed at most once"}
    ]);


    testSampleFile('bad_whitespace.lua', [
        {"code":"612","column":26,"end_column":26,"line":4,"message":"line contains trailing whitespace"},
        {"code":"614","column":25,"end_column":25,"line":8,"message":"trailing whitespace in a comment"},
        {"code":"613","column":20,"end_column":22,"line":14,"message":"trailing whitespace in a string"},
        {"code":"614","column":30,"end_column":30,"line":17,"message":"trailing whitespace in a comment"},
        {"code":"614","column":40,"end_column":40,"line":22,"message":"trailing whitespace in a comment"},
        {"code":"611","column":1,"end_column":1,"line":26,"message":"line contains only whitespace"},
        {"code":"611","column":1,"end_column":1,"line":27,"message":"line contains only whitespace"},
        {"code":"611","column":1,"end_column":2,"line":28,"message":"line contains only whitespace"},
        {"code":"611","column":1,"end_column":3,"line":29,"message":"line contains only whitespace"},
        {"code":"621","column":1,"end_column":2,"line":34,"message":"inconsistent indentation (SPACE followed by TAB)"}
    ]);


    testSampleFile("compat.lua", [
        { "code": "113", "column": 2, "end_column": 8, "line": 1, "name": "setfenv", "message": "accessing undefined variable 'setfenv'" },
        { "code": "113", "column": 14, "end_column": 19, "line": 1, "name": "rawlen", "message": "accessing undefined variable 'rawlen'" },
        { "code": "113", "column": 22, "end_column": 28, "line": 1, "name": "setfenv", "message": "accessing undefined variable 'setfenv'" },
        { "code": "113", "column": 34, "end_column": 39, "line": 1, "name": "rawlen", "message": "accessing undefined variable 'rawlen'" }
    ]);


    testSampleFile("defined.lua", [
        { "code": "111", "column": 1, "end_column": 3, "line": 1, "name": "foo", "message": "setting non-standard global variable 'foo'" },
        { "code": "112", "column": 10, "end_column": 12, "line": 3, "name": "foo", "message": "mutating non-standard global variable 'foo'" },
        { "code": "113", "column": 4, "end_column": 6, "line": 4, "name": "baz", "message": "accessing undefined variable 'baz'" }
    ]);

    testSampleFile("defined2.lua", [
        { "code": "113", "column": 1, "end_column": 3, "line": 1, "name": "foo", "message": "accessing undefined variable 'foo'" }
    ]);

    testSampleFile("defined3.lua", [
        { "code": "111", "column": 1, "end_column": 3, "line": 1, "name": "foo", "message": "setting non-standard global variable 'foo'" },
        {"code": "111", "column": 1, "end_column": 3, "line": 2, "name": "foo", "message": "setting non-standard global variable 'foo'" },
        { "code": "111", "column": 1, "end_column": 3, "line": 3, "name": "bar", "message": "setting non-standard global variable 'bar'" }
    ]);

    testSampleFile("defined4.lua", [
        { "code": "111", "column": 10, "end_column": 12, "line": 1, "name": "foo", "message": "setting non-standard global variable 'foo'" },
        { "code": "111", "column": 4, "end_column": 6, "line": 2, "name": "foo", "message": "setting non-standard global variable 'foo'" },
        { "code": "111", "column": 4, "end_column": 6, "line": 3, "name": "bar", "message": "setting non-standard global variable 'bar'" }
    ]);

    testSampleFile("empty.lua", []);

    testSampleFile("global_inline_options.lua", [
        { "code": "131", "column": 10, "end_column": 10, "line": 6, "name": "f", "message": "unused global variable 'f'" },
        { "code": "111", "column": 4, "end_column": 6, "line": 7, "name": "baz", "message": "setting non-standard global variable 'baz'" },
        { "code": "111", "column": 4, "end_column": 11, "line": 18, "name": "external", "message": "setting non-module global variable 'external'", "module": true }
    ]);

    testSampleFile("globals.lua", [
        { "code": "113", "column": 7, "end_column": 13, "line": 1, "name": "setfenv", "message": "accessing undefined variable 'setfenv'" },
        { "code": "113", "column": 15, "end_column": 20, "line": 1, "name": "rawlen", "message": "accessing undefined variable 'rawlen'" }
    ]);
    testSampleFile("good_code.lua", []);

    testSampleFile("indirect_globals.lua", [
        {"code":"113","column":11,"end_column":16,"line":2,"message":"accessing undefined variable 'global'","name":"global"},
        {"code":"142","column":1,"end_column":8,"line":5,"message":"indirectly setting undefined field 'concat.foo.bar' of global 'table'","name":"table","indirect":true,"field":"concat.foo.bar"},
        {"code":"113","column":32,"end_column":37,"line":5,"message":"accessing undefined variable 'global'","name":"global"}
    ]);

    testSampleFile("inline_options.lua", [
        { "code": "211", "column": 16, "end_column": 16, "line": 6, "name": "f", "message": "unused function 'f'", "func": true },
        { "code": "113", "column": 4, "end_column": 5, "line": 12, "name": "qu", "message": "accessing undefined variable 'qu'" },
        { "code": "113", "column": 1, "end_column": 3, "line": 15, "name": "baz", "message": "accessing undefined variable 'baz'" },
        { "code": "211", "column": 10, "end_column": 10, "line": 22, "name": "g", "message": "unused variable 'g'" },
        { "code": "211", "column": 7, "end_column": 7, "line": 24, "name": "f", "message": "unused variable 'f'" },
        { "code": "211", "column": 10, "end_column": 10, "line": 24, "name": "g", "message": "unused variable 'g'" },
        { "code": "022", "column": 1, "end_column": 17, "line": 26, "message": "unpaired push directive" },
        { "code": "023", "column": 4, "end_column": 19, "line": 28, "message": "unpaired pop directive" },
        { "code": "541", "column": 1, "end_column": 6, "line": 34, "message": "empty do..end block" },
        { "code": "542", "column": 10, "end_column": 13, "line": 35, "message": "empty if branch" }
    ]);

    testSampleFile("python_code.lua", [
        { "code": "011", "column": 6, "end_column": 15, "line": 1, "msg": "expected '=' near '__future__'", "message": "expected '=' near '__future__'" }
    ]);

    testSampleFile("read_globals.lua", [
        {"code":"121","column":1,"end_column":6,"line":1,"message":"setting read-only global variable 'string'","name":"string"},
        {"code":"142","column":1,"end_column":5,"line":2,"message":"setting undefined field 'append' of global 'table'","name":"table","field":"append"},
        {"code":"111","column":1,"end_column":4,"line":3,"message":"setting non-standard global variable '_ENV'","name":"_ENV"},
        {"code":"111","column":1,"end_column":3,"line":4,"message":"setting non-standard global variable 'foo'","name":"foo"},
        {"code":"113","column":18,"end_column":20,"line":4,"message":"accessing undefined variable 'foo'","name":"foo"},
        {"code":"111","column":1,"end_column":3,"line":5,"message":"setting non-standard global variable 'bar'","name":"bar"},
        {"code":"113","column":18,"end_column":20,"line":5,"message":"accessing undefined variable 'bar'","name":"bar"},
        {"code":"112","column":1,"end_column":3,"line":6,"message":"mutating non-standard global variable 'baz'","name":"baz"},
        {"code":"113","column":21,"end_column":23,"line":6,"message":"accessing undefined variable 'baz'","name":"baz"}
    ]);

    testSampleFile("read_globals_inline_options.lua", [
        { "code": "113", "column": 10, "end_column": 12, "line": 2, "name": "baz", "message": "accessing undefined variable 'baz'" },
        { "code": "121", "column": 1, "end_column": 3, "line": 3, "name": "foo", "message": "setting read-only global variable 'foo'" },
        { "code": "111", "column": 11, "end_column": 13, "line": 3, "name": "baz", "message": "setting non-standard global variable 'baz'" },
        { "code": "112", "column": 16, "end_column": 18, "line": 3, "name": "baz", "message": "mutating non-standard global variable 'baz'" },
        { "code": "121", "column": 1, "end_column": 3, "line": 5, "name": "foo", "message": "setting read-only global variable 'foo'" }
    ]);

    testSampleFile("redefined.lua", [
        { "code": "212", "column": 11, "end_column": 11, "line": 3, "name": "self", "message": "unused argument 'self'" },
        { "code": "431", "column": 10, "end_column": 10, "line": 4, "name": "a", "message": "shadowing upvalue 'a' on line 1", "prev_line": 1 },
        { "code": "221", "column": 13, "end_column": 16, "line": 4, "name": "self", "message": "variable 'self' is never set" },
        { "code": "412", "column": 13, "end_column": 16, "line": 4, "name": "self", "message": "variable 'self' was previously defined as an argument on line 3", "prev_line": 3 },
        { "code": "421", "column": 13, "end_column": 13, "line": 7, "name": "a", "message": "shadowing definition of variable 'a' on line 4", "prev_line": 4 },
        { "code": "113", "column": 7, "end_column": 10, "line": 8, "name": "each", "message": "accessing undefined variable 'each'" },
        { "code": "431", "column": 32, "end_column": 35, "line": 8, "name": "self", "message": "shadowing upvalue 'self' on line 4", "prev_line": 4 }
    ]);

    testSampleFile("unused_code.lua", [
        {"code":"212","column":18,"end_column":20,"line":3,"message":"unused argument 'baz'","name":"baz"},
        {"code":"213","column":8,"end_column":8,"line":4,"message":"unused loop variable 'i'","name":"i"},
        {"code":"211","column":13,"end_column":13,"line":5,"message":"unused variable 'q'","name":"q"},
        {"code":"213","column":11,"end_column":11,"line":7,"message":"unused loop variable 'a'","name":"a"},
        {"code":"213","column":14,"end_column":14,"line":7,"message":"unused loop variable 'b'","name":"b"},
        {"code":"213","column":17,"end_column":17,"line":7,"message":"unused loop variable 'c'","name":"c"},
        {"code":"311","column":7,"end_column":7,"line":13,"message":"value assigned to variable 'x' is overwritten on line 14 before use","name":"x"},
        {"code":"311","column":1,"end_column":1,"line":14,"message":"value assigned to variable 'x' is overwritten on line 15 before use","name":"x"},
        {"code":"231","column":7,"end_column":7,"line":21,"message":"variable 'z' is never accessed","name":"z"}
    ]);



    testSampleFile("unused_secondaries.lua", [
        { "code": "211", "column": 7, "end_column": 7, "line": 3, "name": "a", "message": "unused variable 'a'" },
        { "code": "211", "column": 7, "end_column": 7, "line": 6, "name": "x", "message": "unused variable 'x'" },
        { "code": "211", "column": 13, "end_column": 13, "line": 6, "name": "z", "message": "unused variable 'z'" },
        { "code": "311", "column": 1, "end_column": 1, "line": 12, "name": "o", "message": "value assigned to variable 'o' is unused" }
    ]);
});
