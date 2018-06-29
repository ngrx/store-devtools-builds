var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/store-devtools/schematics/ng-add/index", ["require", "exports", "@angular-devkit/schematics", "@angular-devkit/schematics/tasks", "@ngrx/store-devtools/schematics-core/index", "@angular-devkit/core", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var schematics_1 = require("@angular-devkit/schematics");
    var tasks_1 = require("@angular-devkit/schematics/tasks");
    var schematics_core_1 = require("@ngrx/store-devtools/schematics-core/index");
    var core_1 = require("@angular-devkit/core");
    var ts = require("typescript");
    function addImportToNgModule(options) {
        return function (host) {
            var modulePath = options.module;
            if (!modulePath) {
                return host;
            }
            if (!host.exists(modulePath)) {
                throw new Error('Specified module does not exist');
            }
            var text = host.read(modulePath);
            if (text === null) {
                throw new schematics_1.SchematicsException("File " + modulePath + " does not exist.");
            }
            var sourceText = text.toString('utf-8');
            var source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
            var _a = __read(schematics_core_1.addImportToModule(source, modulePath, "StoreDevtoolsModule.instrument({ maxAge: " + options.maxAge + ", logOnly: environment.production })", modulePath), 1), instrumentNgModuleImport = _a[0];
            var srcPath = core_1.dirname(options.path);
            var environmentsPath = schematics_core_1.buildRelativePath(modulePath, "/" + srcPath + "/environments/environment");
            var changes = [
                schematics_core_1.insertImport(source, modulePath, 'StoreDevtoolsModule', '@ngrx/store-devtools'),
                schematics_core_1.insertImport(source, modulePath, 'environment', environmentsPath),
                instrumentNgModuleImport,
            ];
            var recorder = host.beginUpdate(modulePath);
            try {
                for (var changes_1 = __values(changes), changes_1_1 = changes_1.next(); !changes_1_1.done; changes_1_1 = changes_1.next()) {
                    var change = changes_1_1.value;
                    if (change instanceof schematics_core_1.InsertChange) {
                        recorder.insertLeft(change.pos, change.toAdd);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (changes_1_1 && !changes_1_1.done && (_b = changes_1.return)) _b.call(changes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            host.commitUpdate(recorder);
            return host;
            var e_1, _b;
        };
    }
    function addNgRxStoreDevToolsToPackageJson() {
        return function (host, context) {
            schematics_core_1.addPackageToPackageJson(host, 'dependencies', '@ngrx/store-devtools', schematics_core_1.platformVersion);
            context.addTask(new tasks_1.NodePackageInstallTask());
            return host;
        };
    }
    function default_1(options) {
        return function (host, context) {
            options.path = schematics_core_1.getProjectPath(host, options);
            if (options.module) {
                options.module = schematics_core_1.findModuleFromOptions(host, {
                    name: '',
                    module: options.module,
                    path: options.path,
                });
            }
            var parsedPath = schematics_core_1.parseName(options.path, '');
            options.path = parsedPath.path;
            if (options.maxAge < 0 || options.maxAge === 1) {
                throw new schematics_1.SchematicsException("maxAge should be an integer greater than 1.");
            }
            return schematics_1.chain([
                schematics_1.branchAndMerge(schematics_1.chain([addImportToNgModule(options)])),
                options && options.skipPackageJson
                    ? schematics_1.noop()
                    : addNgRxStoreDevToolsToPackageJson(),
            ])(host, context);
        };
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3N0b3JlLWRldnRvb2xzL3NjaGVtYXRpY3MvbmctYWRkL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSx5REFRb0M7SUFDcEMsMERBQTBFO0lBQzFFLDhFQVU4QztJQUM5Qyw2Q0FBcUQ7SUFDckQsK0JBQWlDO0lBR2pDLDZCQUE2QixPQUE2QjtRQUN4RCxNQUFNLENBQUMsVUFBQyxJQUFVO1lBQ2hCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFFbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBRUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsTUFBTSxJQUFJLGdDQUFtQixDQUFDLFVBQVEsVUFBVSxxQkFBa0IsQ0FBQyxDQUFDO1lBQ3RFLENBQUM7WUFDRCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTFDLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDaEMsVUFBVSxFQUNWLFVBQVUsRUFDVixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFDdEIsSUFBSSxDQUNMLENBQUM7WUFFSSxJQUFBLDBM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IFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG4gIGJyYW5jaEFuZE1lcmdlLFxuICBjaGFpbixcbiAgbm9vcCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHsgTm9kZVBhY2thZ2VJbnN0YWxsVGFzayB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rhc2tzJztcbmltcG9ydCB7XG4gIEluc2VydENoYW5nZSxcbiAgYWRkSW1wb3J0VG9Nb2R1bGUsXG4gIGJ1aWxkUmVsYXRpdmVQYXRoLFxuICBmaW5kTW9kdWxlRnJvbU9wdGlvbnMsXG4gIGdldFByb2plY3RQYXRoLFxuICBpbnNlcnRJbXBvcnQsXG4gIGFkZFBhY2thZ2VUb1BhY2thZ2VKc29uLFxuICBwbGF0Zm9ybVZlcnNpb24sXG4gIHBhcnNlTmFtZSxcbn0gZnJvbSAnQG5ncngvc3RvcmUtZGV2dG9vbHMvc2NoZW1hdGljcy1jb3JlJztcbmltcG9ydCB7IFBhdGgsIGRpcm5hbWUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7IFNjaGVtYSBhcyBTdG9yZURldnRvb2xzT3B0aW9ucyB9IGZyb20gJy4vc2NoZW1hJztcblxuZnVuY3Rpb24gYWRkSW1wb3J0VG9OZ01vZHVsZShvcHRpb25zOiBTdG9yZURldnRvb2xzT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCBtb2R1bGVQYXRoID0gb3B0aW9ucy5tb2R1bGU7XG5cbiAgICBpZiAoIW1vZHVsZVBhdGgpIHtcbiAgICAgIHJldHVybiBob3N0O1xuICAgIH1cblxuICAgIGlmICghaG9zdC5leGlzdHMobW9kdWxlUGF0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3BlY2lmaWVkIG1vZHVsZSBkb2VzIG5vdCBleGlzdCcpO1xuICAgIH1cblxuICAgIGNvbnN0IHRleHQgPSBob3N0LnJlYWQobW9kdWxlUGF0aCk7XG4gICAgaWYgKHRleHQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBGaWxlICR7bW9kdWxlUGF0aH0gZG9lcyBub3QgZXhpc3QuYCk7XG4gICAgfVxuICAgIGNvbnN0IHNvdXJjZVRleHQgPSB0ZXh0LnRvU3RyaW5nKCd1dGYtOCcpO1xuXG4gICAgY29uc3Qgc291cmNlID0gdHMuY3JlYXRlU291cmNlRmlsZShcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICBzb3VyY2VUZXh0LFxuICAgICAgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCxcbiAgICAgIHRydWVcbiAgICApO1xuXG4gICAgY29uc3QgW2luc3RydW1lbnROZ01vZHVsZUltcG9ydF0gPSBhZGRJbXBvcnRUb01vZHVsZShcbiAgICAgIHNvdXJjZSxcbiAgICAgIG1vZHVsZVBhdGgsXG4gICAgICBgU3RvcmVEZXZ0b29sc01vZHVsZS5pbnN0cnVtZW50KHsgbWF4QWdlOiAke1xuICAgICAgICBvcHRpb25zLm1heEFnZVxuICAgICAgfSwgbG9nT25seTogZW52aXJvbm1lbnQucHJvZHVjdGlvbiB9KWAsXG4gICAgICBtb2R1bGVQYXRoXG4gICAgKTtcblxuICAgIGNvbnN0IHNyY1BhdGggPSBkaXJuYW1lKG9wdGlvbnMucGF0aCBhcyBQYXRoKTtcbiAgICBjb25zdCBlbnZpcm9ubWVudHNQYXRoID0gYnVpbGRSZWxhdGl2ZVBhdGgoXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgYC8ke3NyY1BhdGh9L2Vudmlyb25tZW50cy9lbnZpcm9ubWVudGBcbiAgICApO1xuXG4gICAgY29uc3QgY2hhbmdlcyA9IFtcbiAgICAgIGluc2VydEltcG9ydChcbiAgICAgICAgc291cmNlLFxuICAgICAgICBtb2R1bGVQYXRoLFxuICAgICAgICAnU3RvcmVEZXZ0b29sc01vZHVsZScsXG4gICAgICAgICdAbmdyeC9zdG9yZS1kZXZ0b29scydcbiAgICAgICksXG4gICAgICBpbnNlcnRJbXBvcnQoc291cmNlLCBtb2R1bGVQYXRoLCAnZW52aXJvbm1lbnQnLCBlbnZpcm9ubWVudHNQYXRoKSxcbiAgICAgIGluc3RydW1lbnROZ01vZHVsZUltcG9ydCxcbiAgICBdO1xuICAgIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShtb2R1bGVQYXRoKTtcblxuICAgIGZvciAoY29uc3QgY2hhbmdlIG9mIGNoYW5nZXMpIHtcbiAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgcmVjb3JkZXIuaW5zZXJ0TGVmdChjaGFuZ2UucG9zLCBjaGFuZ2UudG9BZGQpO1xuICAgICAgfVxuICAgIH1cbiAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG5cbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWRkTmdSeFN0b3JlRGV2VG9vbHNUb1BhY2thZ2VKc29uKCkge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbihcbiAgICAgIGhvc3QsXG4gICAgICAnZGVwZW5kZW5jaWVzJyxcbiAgICAgICdAbmdyeC9zdG9yZS1kZXZ0b29scycsXG4gICAgICBwbGF0Zm9ybVZlcnNpb25cbiAgICApO1xuICAgIGNvbnRleHQuYWRkVGFzayhuZXcgTm9kZVBhY2thZ2VJbnN0YWxsVGFzaygpKTtcbiAgICByZXR1cm4gaG9zdDtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob3B0aW9uczogU3RvcmVEZXZ0b29sc09wdGlvbnMpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgb3B0aW9ucy5wYXRoID0gZ2V0UHJvamVjdFBhdGgoaG9zdCwgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5tb2R1bGUpIHtcbiAgICAgIG9wdGlvbnMubW9kdWxlID0gZmluZE1vZHVsZUZyb21PcHRpb25zKGhvc3QsIHtcbiAgICAgICAgbmFtZTogJycsXG4gICAgICAgIG1vZHVsZTogb3B0aW9ucy5tb2R1bGUsXG4gICAgICAgIHBhdGg6IG9wdGlvbnMucGF0aCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnNlZFBhdGggPSBwYXJzZU5hbWUob3B0aW9ucy5wYXRoLCAnJyk7XG4gICAgb3B0aW9ucy5wYXRoID0gcGFyc2VkUGF0aC5wYXRoO1xuXG4gICAgaWYgKG9wdGlvbnMubWF4QWdlISA8IDAgfHwgb3B0aW9ucy5tYXhBZ2UgPT09IDEpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKFxuICAgICAgICBgbWF4QWdlIHNob3VsZCBiZSBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiAxLmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYWluKFtcbiAgICAgIGJyYW5jaEFuZE1lcmdlKGNoYWluKFthZGRJbXBvcnRUb05nTW9kdWxlKG9wdGlvbnMpXSkpLFxuICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLnNraXBQYWNrYWdlSnNvblxuICAgICAgICA/IG5vb3AoKVxuICAgICAgICA6IGFkZE5nUnhTdG9yZURldlRvb2xzVG9QYWNrYWdlSnNvbigpLFxuICAgIF0pKGhvc3QsIGNvbnRleHQpO1xuICB9O1xufVxuIl19