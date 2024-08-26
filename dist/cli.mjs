#!/usr/bin/env node
import A from"node:process";import G from"node:events";import U from"node:child_process";import L from"node:path";import B from"node:fs";import{r as v,p as J}from"./shared/do-registry-cleanup.632c0437.mjs";import"node:util";var f={},$={},b={};let S=class extends Error{constructor(e,t,i){super(i),Error.captureStackTrace(this,this.constructor),this.name=this.constructor.name,this.code=t,this.exitCode=e,this.nestedError=void 0}},K=class extends S{constructor(e){super(1,"commander.invalidArgument",e),Error.captureStackTrace(this,this.constructor),this.name=this.constructor.name}};b.CommanderError=S,b.InvalidArgumentError=K;const{InvalidArgumentError:z}=b;let Y=class{constructor(e,t){switch(this.description=t||"",this.variadic=!1,this.parseArg=void 0,this.defaultValue=void 0,this.defaultValueDescription=void 0,this.argChoices=void 0,e[0]){case"<":this.required=!0,this._name=e.slice(1,-1);break;case"[":this.required=!1,this._name=e.slice(1,-1);break;default:this.required=!0,this._name=e;break}this._name.length>3&&this._name.slice(-3)==="..."&&(this.variadic=!0,this._name=this._name.slice(0,-3))}name(){return this._name}_concatValue(e,t){return t===this.defaultValue||!Array.isArray(t)?[e]:t.concat(e)}default(e,t){return this.defaultValue=e,this.defaultValueDescription=t,this}argParser(e){return this.parseArg=e,this}choices(e){return this.argChoices=e.slice(),this.parseArg=(t,i)=>{if(!this.argChoices.includes(t))throw new z(`Allowed choices are ${this.argChoices.join(", ")}.`);return this.variadic?this._concatValue(t,i):t},this}argRequired(){return this.required=!0,this}argOptional(){return this.required=!1,this}};function Q(h){const e=h.name()+(h.variadic===!0?"...":"");return h.required?"<"+e+">":"["+e+"]"}$.Argument=Y,$.humanReadableArgName=Q;var N={},y={};const{humanReadableArgName:X}=$;let Z=class{constructor(){this.helpWidth=void 0,this.sortSubcommands=!1,this.sortOptions=!1,this.showGlobalOptions=!1}visibleCommands(e){const t=e.commands.filter(n=>!n._hidden),i=e._getHelpCommand();return i&&!i._hidden&&t.push(i),this.sortSubcommands&&t.sort((n,s)=>n.name().localeCompare(s.name())),t}compareOptions(e,t){const i=n=>n.short?n.short.replace(/^-/,""):n.long.replace(/^--/,"");return i(e).localeCompare(i(t))}visibleOptions(e){const t=e.options.filter(n=>!n.hidden),i=e._getHelpOption();if(i&&!i.hidden){const n=i.short&&e._findOption(i.short),s=i.long&&e._findOption(i.long);!n&&!s?t.push(i):i.long&&!s?t.push(e.createOption(i.long,i.description)):i.short&&!n&&t.push(e.createOption(i.short,i.description))}return this.sortOptions&&t.sort(this.compareOptions),t}visibleGlobalOptions(e){if(!this.showGlobalOptions)return[];const t=[];for(let i=e.parent;i;i=i.parent){const n=i.options.filter(s=>!s.hidden);t.push(...n)}return this.sortOptions&&t.sort(this.compareOptions),t}visibleArguments(e){return e._argsDescription&&e.registeredArguments.forEach(t=>{t.description=t.description||e._argsDescription[t.name()]||""}),e.registeredArguments.find(t=>t.description)?e.registeredArguments:[]}subcommandTerm(e){const t=e.registeredArguments.map(i=>X(i)).join(" ");return e._name+(e._aliases[0]?"|"+e._aliases[0]:"")+(e.options.length?" [options]":"")+(t?" "+t:"")}optionTerm(e){return e.flags}argumentTerm(e){return e.name()}longestSubcommandTermLength(e,t){return t.visibleCommands(e).reduce((i,n)=>Math.max(i,t.subcommandTerm(n).length),0)}longestOptionTermLength(e,t){return t.visibleOptions(e).reduce((i,n)=>Math.max(i,t.optionTerm(n).length),0)}longestGlobalOptionTermLength(e,t){return t.visibleGlobalOptions(e).reduce((i,n)=>Math.max(i,t.optionTerm(n).length),0)}longestArgumentTermLength(e,t){return t.visibleArguments(e).reduce((i,n)=>Math.max(i,t.argumentTerm(n).length),0)}commandUsage(e){let t=e._name;e._aliases[0]&&(t=t+"|"+e._aliases[0]);let i="";for(let n=e.parent;n;n=n.parent)i=n.name()+" "+i;return i+t+" "+e.usage()}commandDescription(e){return e.description()}subcommandDescription(e){return e.summary()||e.description()}optionDescription(e){const t=[];return e.argChoices&&t.push(`choices: ${e.argChoices.map(i=>JSON.stringify(i)).join(", ")}`),e.defaultValue!==void 0&&(e.required||e.optional||e.isBoolean()&&typeof e.defaultValue=="boolean")&&t.push(`default: ${e.defaultValueDescription||JSON.stringify(e.defaultValue)}`),e.presetArg!==void 0&&e.optional&&t.push(`preset: ${JSON.stringify(e.presetArg)}`),e.envVar!==void 0&&t.push(`env: ${e.envVar}`),t.length>0?`${e.description} (${t.join(", ")})`:e.description}argumentDescription(e){const t=[];if(e.argChoices&&t.push(`choices: ${e.argChoices.map(i=>JSON.stringify(i)).join(", ")}`),e.defaultValue!==void 0&&t.push(`default: ${e.defaultValueDescription||JSON.stringify(e.defaultValue)}`),t.length>0){const i=`(${t.join(", ")})`;return e.description?`${e.description} ${i}`:i}return e.description}formatHelp(e,t){const i=t.padWidth(e,t),n=t.helpWidth||80,s=2,r=2;function a(d,O){if(O){const E=`${d.padEnd(i+r)}${O}`;return t.wrap(E,n-s,i+r)}return d}function o(d){return d.join(`
`).replace(/^/gm," ".repeat(s))}let l=[`Usage: ${t.commandUsage(e)}`,""];const u=t.commandDescription(e);u.length>0&&(l=l.concat([t.wrap(u,n,0),""]));const c=t.visibleArguments(e).map(d=>a(t.argumentTerm(d),t.argumentDescription(d)));c.length>0&&(l=l.concat(["Arguments:",o(c),""]));const p=t.visibleOptions(e).map(d=>a(t.optionTerm(d),t.optionDescription(d)));if(p.length>0&&(l=l.concat(["Options:",o(p),""])),this.showGlobalOptions){const d=t.visibleGlobalOptions(e).map(O=>a(t.optionTerm(O),t.optionDescription(O)));d.length>0&&(l=l.concat(["Global Options:",o(d),""]))}const C=t.visibleCommands(e).map(d=>a(t.subcommandTerm(d),t.subcommandDescription(d)));return C.length>0&&(l=l.concat(["Commands:",o(C),""])),l.join(`
`)}padWidth(e,t){return Math.max(t.longestOptionTermLength(e,t),t.longestGlobalOptionTermLength(e,t),t.longestSubcommandTermLength(e,t),t.longestArgumentTermLength(e,t))}wrap(e,t,i,n=40){const s=" \\f\\t\\v\xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF",r=new RegExp(`[\\n][${s}]+`);if(e.match(r))return e;const a=t-i;if(a<n)return e;const o=e.slice(0,i),l=e.slice(i).replace(`\r
`,`
`),u=" ".repeat(i),p="\\s\u200B",C=new RegExp(`
|.{1,${a-1}}([${p}]|$)|[^${p}]+?([${p}]|$)`,"g"),d=l.match(C)||[];return o+d.map((O,E)=>O===`
`?"":(E>0?u:"")+O.trimEnd()).join(`
`)}};y.Help=Z;var w={};const{InvalidArgumentError:ee}=b;let te=class{constructor(e,t){this.flags=e,this.description=t||"",this.required=e.includes("<"),this.optional=e.includes("["),this.variadic=/\w\.\.\.[>\]]$/.test(e),this.mandatory=!1;const i=se(e);this.short=i.shortFlag,this.long=i.longFlag,this.negate=!1,this.long&&(this.negate=this.long.startsWith("--no-")),this.defaultValue=void 0,this.defaultValueDescription=void 0,this.presetArg=void 0,this.envVar=void 0,this.parseArg=void 0,this.hidden=!1,this.argChoices=void 0,this.conflictsWith=[],this.implied=void 0}default(e,t){return this.defaultValue=e,this.defaultValueDescription=t,this}preset(e){return this.presetArg=e,this}conflicts(e){return this.conflictsWith=this.conflictsWith.concat(e),this}implies(e){let t=e;return typeof e=="string"&&(t={[e]:!0}),this.implied=Object.assign(this.implied||{},t),this}env(e){return this.envVar=e,this}argParser(e){return this.parseArg=e,this}makeOptionMandatory(e=!0){return this.mandatory=!!e,this}hideHelp(e=!0){return this.hidden=!!e,this}_concatValue(e,t){return t===this.defaultValue||!Array.isArray(t)?[e]:t.concat(e)}choices(e){return this.argChoices=e.slice(),this.parseArg=(t,i)=>{if(!this.argChoices.includes(t))throw new ee(`Allowed choices are ${this.argChoices.join(", ")}.`);return this.variadic?this._concatValue(t,i):t},this}name(){return this.long?this.long.replace(/^--/,""):this.short.replace(/^-/,"")}attributeName(){return ne(this.name().replace(/^no-/,""))}is(e){return this.short===e||this.long===e}isBoolean(){return!this.required&&!this.optional&&!this.negate}},ie=class{constructor(e){this.positiveOptions=new Map,this.negativeOptions=new Map,this.dualOptions=new Set,e.forEach(t=>{t.negate?this.negativeOptions.set(t.attributeName(),t):this.positiveOptions.set(t.attributeName(),t)}),this.negativeOptions.forEach((t,i)=>{this.positiveOptions.has(i)&&this.dualOptions.add(i)})}valueFromOption(e,t){const i=t.attributeName();if(!this.dualOptions.has(i))return!0;const n=this.negativeOptions.get(i).presetArg,s=n!==void 0?n:!1;return t.negate===(s===e)}};function ne(h){return h.split("-").reduce((e,t)=>e+t[0].toUpperCase()+t.slice(1))}function se(h){let e,t;const i=h.split(/[ |,]+/);return i.length>1&&!/^[[<]/.test(i[1])&&(e=i.shift()),t=i.shift(),!e&&/^-[^-]$/.test(t)&&(e=t,t=void 0),{shortFlag:e,longFlag:t}}w.Option=te,w.DualOptions=ie;var P={};const I=3;function re(h,e){if(Math.abs(h.length-e.length)>I)return Math.max(h.length,e.length);const t=[];for(let i=0;i<=h.length;i++)t[i]=[i];for(let i=0;i<=e.length;i++)t[0][i]=i;for(let i=1;i<=e.length;i++)for(let n=1;n<=h.length;n++){let s=1;h[n-1]===e[i-1]?s=0:s=1,t[n][i]=Math.min(t[n-1][i]+1,t[n][i-1]+1,t[n-1][i-1]+s),n>1&&i>1&&h[n-1]===e[i-2]&&h[n-2]===e[i-1]&&(t[n][i]=Math.min(t[n][i],t[n-2][i-2]+1))}return t[h.length][e.length]}function oe(h,e){if(!e||e.length===0)return"";e=Array.from(new Set(e));const t=h.startsWith("--");t&&(h=h.slice(2),e=e.map(r=>r.slice(2)));let i=[],n=I;const s=.4;return e.forEach(r=>{if(r.length<=1)return;const a=re(h,r),o=Math.max(h.length,r.length);(o-a)/o>s&&(a<n?(n=a,i=[r]):a===n&&i.push(r))}),i.sort((r,a)=>r.localeCompare(a)),t&&(i=i.map(r=>`--${r}`)),i.length>1?`
(Did you mean one of ${i.join(", ")}?)`:i.length===1?`
(Did you mean ${i[0]}?)`:""}P.suggestSimilar=oe;const ae=G.EventEmitter,x=U,g=L,H=B,m=A,{Argument:le,humanReadableArgName:ue}=$,{CommanderError:V}=b,{Help:he}=y,{Option:D,DualOptions:ce}=w,{suggestSimilar:F}=P;let me=class R extends ae{constructor(e){super(),this.commands=[],this.options=[],this.parent=null,this._allowUnknownOption=!1,this._allowExcessArguments=!0,this.registeredArguments=[],this._args=this.registeredArguments,this.args=[],this.rawArgs=[],this.processedArgs=[],this._scriptPath=null,this._name=e||"",this._optionValues={},this._optionValueSources={},this._storeOptionsAsProperties=!1,this._actionHandler=null,this._executableHandler=!1,this._executableFile=null,this._executableDir=null,this._defaultCommandName=null,this._exitCallback=null,this._aliases=[],this._combineFlagAndOptionalValue=!0,this._description="",this._summary="",this._argsDescription=void 0,this._enablePositionalOptions=!1,this._passThroughOptions=!1,this._lifeCycleHooks={},this._showHelpAfterError=!1,this._showSuggestionAfterError=!0,this._outputConfiguration={writeOut:t=>m.stdout.write(t),writeErr:t=>m.stderr.write(t),getOutHelpWidth:()=>m.stdout.isTTY?m.stdout.columns:void 0,getErrHelpWidth:()=>m.stderr.isTTY?m.stderr.columns:void 0,outputError:(t,i)=>i(t)},this._hidden=!1,this._helpOption=void 0,this._addImplicitHelpCommand=void 0,this._helpCommand=void 0,this._helpConfiguration={}}copyInheritedSettings(e){return this._outputConfiguration=e._outputConfiguration,this._helpOption=e._helpOption,this._helpCommand=e._helpCommand,this._helpConfiguration=e._helpConfiguration,this._exitCallback=e._exitCallback,this._storeOptionsAsProperties=e._storeOptionsAsProperties,this._combineFlagAndOptionalValue=e._combineFlagAndOptionalValue,this._allowExcessArguments=e._allowExcessArguments,this._enablePositionalOptions=e._enablePositionalOptions,this._showHelpAfterError=e._showHelpAfterError,this._showSuggestionAfterError=e._showSuggestionAfterError,this}_getCommandAndAncestors(){const e=[];for(let t=this;t;t=t.parent)e.push(t);return e}command(e,t,i){let n=t,s=i;typeof n=="object"&&n!==null&&(s=n,n=null),s=s||{};const[,r,a]=e.match(/([^ ]+) *(.*)/),o=this.createCommand(r);return n&&(o.description(n),o._executableHandler=!0),s.isDefault&&(this._defaultCommandName=o._name),o._hidden=!!(s.noHelp||s.hidden),o._executableFile=s.executableFile||null,a&&o.arguments(a),this._registerCommand(o),o.parent=this,o.copyInheritedSettings(this),n?this:o}createCommand(e){return new R(e)}createHelp(){return Object.assign(new he,this.configureHelp())}configureHelp(e){return e===void 0?this._helpConfiguration:(this._helpConfiguration=e,this)}configureOutput(e){return e===void 0?this._outputConfiguration:(Object.assign(this._outputConfiguration,e),this)}showHelpAfterError(e=!0){return typeof e!="string"&&(e=!!e),this._showHelpAfterError=e,this}showSuggestionAfterError(e=!0){return this._showSuggestionAfterError=!!e,this}addCommand(e,t){if(!e._name)throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);return t=t||{},t.isDefault&&(this._defaultCommandName=e._name),(t.noHelp||t.hidden)&&(e._hidden=!0),this._registerCommand(e),e.parent=this,e._checkForBrokenPassThrough(),this}createArgument(e,t){return new le(e,t)}argument(e,t,i,n){const s=this.createArgument(e,t);return typeof i=="function"?s.default(n).argParser(i):s.default(i),this.addArgument(s),this}arguments(e){return e.trim().split(/ +/).forEach(t=>{this.argument(t)}),this}addArgument(e){const t=this.registeredArguments.slice(-1)[0];if(t&&t.variadic)throw new Error(`only the last argument can be variadic '${t.name()}'`);if(e.required&&e.defaultValue!==void 0&&e.parseArg===void 0)throw new Error(`a default value for a required argument is never used: '${e.name()}'`);return this.registeredArguments.push(e),this}helpCommand(e,t){if(typeof e=="boolean")return this._addImplicitHelpCommand=e,this;e=e??"help [command]";const[,i,n]=e.match(/([^ ]+) *(.*)/),s=t??"display help for command",r=this.createCommand(i);return r.helpOption(!1),n&&r.arguments(n),s&&r.description(s),this._addImplicitHelpCommand=!0,this._helpCommand=r,this}addHelpCommand(e,t){return typeof e!="object"?(this.helpCommand(e,t),this):(this._addImplicitHelpCommand=!0,this._helpCommand=e,this)}_getHelpCommand(){return this._addImplicitHelpCommand??(this.commands.length&&!this._actionHandler&&!this._findCommand("help"))?(this._helpCommand===void 0&&this.helpCommand(void 0,void 0),this._helpCommand):null}hook(e,t){const i=["preSubcommand","preAction","postAction"];if(!i.includes(e))throw new Error(`Unexpected value for event passed to hook : '${e}'.
Expecting one of '${i.join("', '")}'`);return this._lifeCycleHooks[e]?this._lifeCycleHooks[e].push(t):this._lifeCycleHooks[e]=[t],this}exitOverride(e){return e?this._exitCallback=e:this._exitCallback=t=>{if(t.code!=="commander.executeSubCommandAsync")throw t},this}_exit(e,t,i){this._exitCallback&&this._exitCallback(new V(e,t,i)),m.exit(e)}action(e){const t=i=>{const n=this.registeredArguments.length,s=i.slice(0,n);return this._storeOptionsAsProperties?s[n]=this:s[n]=this.opts(),s.push(this),e.apply(this,s)};return this._actionHandler=t,this}createOption(e,t){return new D(e,t)}_callParseArg(e,t,i,n){try{return e.parseArg(t,i)}catch(s){if(s.code==="commander.invalidArgument"){const r=`${n} ${s.message}`;this.error(r,{exitCode:s.exitCode,code:s.code})}throw s}}_registerOption(e){const t=e.short&&this._findOption(e.short)||e.long&&this._findOption(e.long);if(t){const i=e.long&&this._findOption(e.long)?e.long:e.short;throw new Error(`Cannot add option '${e.flags}'${this._name&&` to command '${this._name}'`} due to conflicting flag '${i}'
-  already used by option '${t.flags}'`)}this.options.push(e)}_registerCommand(e){const t=n=>[n.name()].concat(n.aliases()),i=t(e).find(n=>this._findCommand(n));if(i){const n=t(this._findCommand(i)).join("|"),s=t(e).join("|");throw new Error(`cannot add command '${s}' as already have command '${n}'`)}this.commands.push(e)}addOption(e){this._registerOption(e);const t=e.name(),i=e.attributeName();if(e.negate){const s=e.long.replace(/^--no-/,"--");this._findOption(s)||this.setOptionValueWithSource(i,e.defaultValue===void 0?!0:e.defaultValue,"default")}else e.defaultValue!==void 0&&this.setOptionValueWithSource(i,e.defaultValue,"default");const n=(s,r,a)=>{s==null&&e.presetArg!==void 0&&(s=e.presetArg);const o=this.getOptionValue(i);s!==null&&e.parseArg?s=this._callParseArg(e,s,o,r):s!==null&&e.variadic&&(s=e._concatValue(s,o)),s==null&&(e.negate?s=!1:e.isBoolean()||e.optional?s=!0:s=""),this.setOptionValueWithSource(i,s,a)};return this.on("option:"+t,s=>{const r=`error: option '${e.flags}' argument '${s}' is invalid.`;n(s,r,"cli")}),e.envVar&&this.on("optionEnv:"+t,s=>{const r=`error: option '${e.flags}' value '${s}' from env '${e.envVar}' is invalid.`;n(s,r,"env")}),this}_optionEx(e,t,i,n,s){if(typeof t=="object"&&t instanceof D)throw new Error("To add an Option object use addOption() instead of option() or requiredOption()");const r=this.createOption(t,i);if(r.makeOptionMandatory(!!e.mandatory),typeof n=="function")r.default(s).argParser(n);else if(n instanceof RegExp){const a=n;n=(o,l)=>{const u=a.exec(o);return u?u[0]:l},r.default(s).argParser(n)}else r.default(n);return this.addOption(r)}option(e,t,i,n){return this._optionEx({},e,t,i,n)}requiredOption(e,t,i,n){return this._optionEx({mandatory:!0},e,t,i,n)}combineFlagAndOptionalValue(e=!0){return this._combineFlagAndOptionalValue=!!e,this}allowUnknownOption(e=!0){return this._allowUnknownOption=!!e,this}allowExcessArguments(e=!0){return this._allowExcessArguments=!!e,this}enablePositionalOptions(e=!0){return this._enablePositionalOptions=!!e,this}passThroughOptions(e=!0){return this._passThroughOptions=!!e,this._checkForBrokenPassThrough(),this}_checkForBrokenPassThrough(){if(this.parent&&this._passThroughOptions&&!this.parent._enablePositionalOptions)throw new Error(`passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`)}storeOptionsAsProperties(e=!0){if(this.options.length)throw new Error("call .storeOptionsAsProperties() before adding options");if(Object.keys(this._optionValues).length)throw new Error("call .storeOptionsAsProperties() before setting option values");return this._storeOptionsAsProperties=!!e,this}getOptionValue(e){return this._storeOptionsAsProperties?this[e]:this._optionValues[e]}setOptionValue(e,t){return this.setOptionValueWithSource(e,t,void 0)}setOptionValueWithSource(e,t,i){return this._storeOptionsAsProperties?this[e]=t:this._optionValues[e]=t,this._optionValueSources[e]=i,this}getOptionValueSource(e){return this._optionValueSources[e]}getOptionValueSourceWithGlobals(e){let t;return this._getCommandAndAncestors().forEach(i=>{i.getOptionValueSource(e)!==void 0&&(t=i.getOptionValueSource(e))}),t}_prepareUserArgs(e,t){if(e!==void 0&&!Array.isArray(e))throw new Error("first parameter to parse must be array or undefined");if(t=t||{},e===void 0&&t.from===void 0){m.versions?.electron&&(t.from="electron");const n=m.execArgv??[];(n.includes("-e")||n.includes("--eval")||n.includes("-p")||n.includes("--print"))&&(t.from="eval")}e===void 0&&(e=m.argv),this.rawArgs=e.slice();let i;switch(t.from){case void 0:case"node":this._scriptPath=e[1],i=e.slice(2);break;case"electron":m.defaultApp?(this._scriptPath=e[1],i=e.slice(2)):i=e.slice(1);break;case"user":i=e.slice(0);break;case"eval":i=e.slice(1);break;default:throw new Error(`unexpected parse option { from: '${t.from}' }`)}return!this._name&&this._scriptPath&&this.nameFromFilename(this._scriptPath),this._name=this._name||"program",i}parse(e,t){const i=this._prepareUserArgs(e,t);return this._parseCommand([],i),this}async parseAsync(e,t){const i=this._prepareUserArgs(e,t);return await this._parseCommand([],i),this}_executeSubCommand(e,t){t=t.slice();let i=!1;const n=[".js",".ts",".tsx",".mjs",".cjs"];function s(u,c){const p=g.resolve(u,c);if(H.existsSync(p))return p;if(n.includes(g.extname(c)))return;const C=n.find(d=>H.existsSync(`${p}${d}`));if(C)return`${p}${C}`}this._checkForMissingMandatoryOptions(),this._checkForConflictingOptions();let r=e._executableFile||`${this._name}-${e._name}`,a=this._executableDir||"";if(this._scriptPath){let u;try{u=H.realpathSync(this._scriptPath)}catch{u=this._scriptPath}a=g.resolve(g.dirname(u),a)}if(a){let u=s(a,r);if(!u&&!e._executableFile&&this._scriptPath){const c=g.basename(this._scriptPath,g.extname(this._scriptPath));c!==this._name&&(u=s(a,`${c}-${e._name}`))}r=u||r}i=n.includes(g.extname(r));let o;m.platform!=="win32"?i?(t.unshift(r),t=T(m.execArgv).concat(t),o=x.spawn(m.argv[0],t,{stdio:"inherit"})):o=x.spawn(r,t,{stdio:"inherit"}):(t.unshift(r),t=T(m.execArgv).concat(t),o=x.spawn(m.execPath,t,{stdio:"inherit"})),o.killed||["SIGUSR1","SIGUSR2","SIGTERM","SIGINT","SIGHUP"].forEach(c=>{m.on(c,()=>{o.killed===!1&&o.exitCode===null&&o.kill(c)})});const l=this._exitCallback;o.on("close",u=>{u=u??1,l?l(new V(u,"commander.executeSubCommandAsync","(close)")):m.exit(u)}),o.on("error",u=>{if(u.code==="ENOENT"){const c=a?`searched for local subcommand relative to directory '${a}'`:"no directory for search for local subcommand, use .executableDir() to supply a custom directory",p=`'${r}' does not exist
 - if '${e._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${c}`;throw new Error(p)}else if(u.code==="EACCES")throw new Error(`'${r}' not executable`);if(!l)m.exit(1);else{const c=new V(1,"commander.executeSubCommandAsync","(error)");c.nestedError=u,l(c)}}),this.runningCommand=o}_dispatchSubcommand(e,t,i){const n=this._findCommand(e);n||this.help({error:!0});let s;return s=this._chainOrCallSubCommandHook(s,n,"preSubcommand"),s=this._chainOrCall(s,()=>{if(n._executableHandler)this._executeSubCommand(n,t.concat(i));else return n._parseCommand(t,i)}),s}_dispatchHelpCommand(e){e||this.help();const t=this._findCommand(e);return t&&!t._executableHandler&&t.help(),this._dispatchSubcommand(e,[],[this._getHelpOption()?.long??this._getHelpOption()?.short??"--help"])}_checkNumberOfArguments(){this.registeredArguments.forEach((e,t)=>{e.required&&this.args[t]==null&&this.missingArgument(e.name())}),!(this.registeredArguments.length>0&&this.registeredArguments[this.registeredArguments.length-1].variadic)&&this.args.length>this.registeredArguments.length&&this._excessArguments(this.args)}_processArguments(){const e=(i,n,s)=>{let r=n;if(n!==null&&i.parseArg){const a=`error: command-argument value '${n}' is invalid for argument '${i.name()}'.`;r=this._callParseArg(i,n,s,a)}return r};this._checkNumberOfArguments();const t=[];this.registeredArguments.forEach((i,n)=>{let s=i.defaultValue;i.variadic?n<this.args.length?(s=this.args.slice(n),i.parseArg&&(s=s.reduce((r,a)=>e(i,a,r),i.defaultValue))):s===void 0&&(s=[]):n<this.args.length&&(s=this.args[n],i.parseArg&&(s=e(i,s,i.defaultValue))),t[n]=s}),this.processedArgs=t}_chainOrCall(e,t){return e&&e.then&&typeof e.then=="function"?e.then(()=>t()):t()}_chainOrCallHooks(e,t){let i=e;const n=[];return this._getCommandAndAncestors().reverse().filter(s=>s._lifeCycleHooks[t]!==void 0).forEach(s=>{s._lifeCycleHooks[t].forEach(r=>{n.push({hookedCommand:s,callback:r})})}),t==="postAction"&&n.reverse(),n.forEach(s=>{i=this._chainOrCall(i,()=>s.callback(s.hookedCommand,this))}),i}_chainOrCallSubCommandHook(e,t,i){let n=e;return this._lifeCycleHooks[i]!==void 0&&this._lifeCycleHooks[i].forEach(s=>{n=this._chainOrCall(n,()=>s(this,t))}),n}_parseCommand(e,t){const i=this.parseOptions(t);if(this._parseOptionsEnv(),this._parseOptionsImplied(),e=e.concat(i.operands),t=i.unknown,this.args=e.concat(t),e&&this._findCommand(e[0]))return this._dispatchSubcommand(e[0],e.slice(1),t);if(this._getHelpCommand()&&e[0]===this._getHelpCommand().name())return this._dispatchHelpCommand(e[1]);if(this._defaultCommandName)return this._outputHelpIfRequested(t),this._dispatchSubcommand(this._defaultCommandName,e,t);this.commands.length&&this.args.length===0&&!this._actionHandler&&!this._defaultCommandName&&this.help({error:!0}),this._outputHelpIfRequested(i.unknown),this._checkForMissingMandatoryOptions(),this._checkForConflictingOptions();const n=()=>{i.unknown.length>0&&this.unknownOption(i.unknown[0])},s=`command:${this.name()}`;if(this._actionHandler){n(),this._processArguments();let r;return r=this._chainOrCallHooks(r,"preAction"),r=this._chainOrCall(r,()=>this._actionHandler(this.processedArgs)),this.parent&&(r=this._chainOrCall(r,()=>{this.parent.emit(s,e,t)})),r=this._chainOrCallHooks(r,"postAction"),r}if(this.parent&&this.parent.listenerCount(s))n(),this._processArguments(),this.parent.emit(s,e,t);else if(e.length){if(this._findCommand("*"))return this._dispatchSubcommand("*",e,t);this.listenerCount("command:*")?this.emit("command:*",e,t):this.commands.length?this.unknownCommand():(n(),this._processArguments())}else this.commands.length?(n(),this.help({error:!0})):(n(),this._processArguments())}_findCommand(e){if(e)return this.commands.find(t=>t._name===e||t._aliases.includes(e))}_findOption(e){return this.options.find(t=>t.is(e))}_checkForMissingMandatoryOptions(){this._getCommandAndAncestors().forEach(e=>{e.options.forEach(t=>{t.mandatory&&e.getOptionValue(t.attributeName())===void 0&&e.missingMandatoryOptionValue(t)})})}_checkForConflictingLocalOptions(){const e=this.options.filter(i=>{const n=i.attributeName();return this.getOptionValue(n)===void 0?!1:this.getOptionValueSource(n)!=="default"});e.filter(i=>i.conflictsWith.length>0).forEach(i=>{const n=e.find(s=>i.conflictsWith.includes(s.attributeName()));n&&this._conflictingOption(i,n)})}_checkForConflictingOptions(){this._getCommandAndAncestors().forEach(e=>{e._checkForConflictingLocalOptions()})}parseOptions(e){const t=[],i=[];let n=t;const s=e.slice();function r(o){return o.length>1&&o[0]==="-"}let a=null;for(;s.length;){const o=s.shift();if(o==="--"){n===i&&n.push(o),n.push(...s);break}if(a&&!r(o)){this.emit(`option:${a.name()}`,o);continue}if(a=null,r(o)){const l=this._findOption(o);if(l){if(l.required){const u=s.shift();u===void 0&&this.optionMissingArgument(l),this.emit(`option:${l.name()}`,u)}else if(l.optional){let u=null;s.length>0&&!r(s[0])&&(u=s.shift()),this.emit(`option:${l.name()}`,u)}else this.emit(`option:${l.name()}`);a=l.variadic?l:null;continue}}if(o.length>2&&o[0]==="-"&&o[1]!=="-"){const l=this._findOption(`-${o[1]}`);if(l){l.required||l.optional&&this._combineFlagAndOptionalValue?this.emit(`option:${l.name()}`,o.slice(2)):(this.emit(`option:${l.name()}`),s.unshift(`-${o.slice(2)}`));continue}}if(/^--[^=]+=/.test(o)){const l=o.indexOf("="),u=this._findOption(o.slice(0,l));if(u&&(u.required||u.optional)){this.emit(`option:${u.name()}`,o.slice(l+1));continue}}if(r(o)&&(n=i),(this._enablePositionalOptions||this._passThroughOptions)&&t.length===0&&i.length===0){if(this._findCommand(o)){t.push(o),s.length>0&&i.push(...s);break}else if(this._getHelpCommand()&&o===this._getHelpCommand().name()){t.push(o),s.length>0&&t.push(...s);break}else if(this._defaultCommandName){i.push(o),s.length>0&&i.push(...s);break}}if(this._passThroughOptions){n.push(o),s.length>0&&n.push(...s);break}n.push(o)}return{operands:t,unknown:i}}opts(){if(this._storeOptionsAsProperties){const e={},t=this.options.length;for(let i=0;i<t;i++){const n=this.options[i].attributeName();e[n]=n===this._versionOptionName?this._version:this[n]}return e}return this._optionValues}optsWithGlobals(){return this._getCommandAndAncestors().reduce((e,t)=>Object.assign(e,t.opts()),{})}error(e,t){this._outputConfiguration.outputError(`${e}
`,this._outputConfiguration.writeErr),typeof this._showHelpAfterError=="string"?this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`):this._showHelpAfterError&&(this._outputConfiguration.writeErr(`
`),this.outputHelp({error:!0}));const i=t||{},n=i.exitCode||1,s=i.code||"commander.error";this._exit(n,s,e)}_parseOptionsEnv(){this.options.forEach(e=>{if(e.envVar&&e.envVar in m.env){const t=e.attributeName();(this.getOptionValue(t)===void 0||["default","config","env"].includes(this.getOptionValueSource(t)))&&(e.required||e.optional?this.emit(`optionEnv:${e.name()}`,m.env[e.envVar]):this.emit(`optionEnv:${e.name()}`))}})}_parseOptionsImplied(){const e=new ce(this.options),t=i=>this.getOptionValue(i)!==void 0&&!["default","implied"].includes(this.getOptionValueSource(i));this.options.filter(i=>i.implied!==void 0&&t(i.attributeName())&&e.valueFromOption(this.getOptionValue(i.attributeName()),i)).forEach(i=>{Object.keys(i.implied).filter(n=>!t(n)).forEach(n=>{this.setOptionValueWithSource(n,i.implied[n],"implied")})})}missingArgument(e){const t=`error: missing required argument '${e}'`;this.error(t,{code:"commander.missingArgument"})}optionMissingArgument(e){const t=`error: option '${e.flags}' argument missing`;this.error(t,{code:"commander.optionMissingArgument"})}missingMandatoryOptionValue(e){const t=`error: required option '${e.flags}' not specified`;this.error(t,{code:"commander.missingMandatoryOptionValue"})}_conflictingOption(e,t){const i=r=>{const a=r.attributeName(),o=this.getOptionValue(a),l=this.options.find(c=>c.negate&&a===c.attributeName()),u=this.options.find(c=>!c.negate&&a===c.attributeName());return l&&(l.presetArg===void 0&&o===!1||l.presetArg!==void 0&&o===l.presetArg)?l:u||r},n=r=>{const a=i(r),o=a.attributeName();return this.getOptionValueSource(o)==="env"?`environment variable '${a.envVar}'`:`option '${a.flags}'`},s=`error: ${n(e)} cannot be used with ${n(t)}`;this.error(s,{code:"commander.conflictingOption"})}unknownOption(e){if(this._allowUnknownOption)return;let t="";if(e.startsWith("--")&&this._showSuggestionAfterError){let n=[],s=this;do{const r=s.createHelp().visibleOptions(s).filter(a=>a.long).map(a=>a.long);n=n.concat(r),s=s.parent}while(s&&!s._enablePositionalOptions);t=F(e,n)}const i=`error: unknown option '${e}'${t}`;this.error(i,{code:"commander.unknownOption"})}_excessArguments(e){if(this._allowExcessArguments)return;const t=this.registeredArguments.length,i=t===1?"":"s",s=`error: too many arguments${this.parent?` for '${this.name()}'`:""}. Expected ${t} argument${i} but got ${e.length}.`;this.error(s,{code:"commander.excessArguments"})}unknownCommand(){const e=this.args[0];let t="";if(this._showSuggestionAfterError){const n=[];this.createHelp().visibleCommands(this).forEach(s=>{n.push(s.name()),s.alias()&&n.push(s.alias())}),t=F(e,n)}const i=`error: unknown command '${e}'${t}`;this.error(i,{code:"commander.unknownCommand"})}version(e,t,i){if(e===void 0)return this._version;this._version=e,t=t||"-V, --version",i=i||"output the version number";const n=this.createOption(t,i);return this._versionOptionName=n.attributeName(),this._registerOption(n),this.on("option:"+n.name(),()=>{this._outputConfiguration.writeOut(`${e}
`),this._exit(0,"commander.version",e)}),this}description(e,t){return e===void 0&&t===void 0?this._description:(this._description=e,t&&(this._argsDescription=t),this)}summary(e){return e===void 0?this._summary:(this._summary=e,this)}alias(e){if(e===void 0)return this._aliases[0];let t=this;if(this.commands.length!==0&&this.commands[this.commands.length-1]._executableHandler&&(t=this.commands[this.commands.length-1]),e===t._name)throw new Error("Command alias can't be the same as its name");const i=this.parent?._findCommand(e);if(i){const n=[i.name()].concat(i.aliases()).join("|");throw new Error(`cannot add alias '${e}' to command '${this.name()}' as already have command '${n}'`)}return t._aliases.push(e),this}aliases(e){return e===void 0?this._aliases:(e.forEach(t=>this.alias(t)),this)}usage(e){if(e===void 0){if(this._usage)return this._usage;const t=this.registeredArguments.map(i=>ue(i));return[].concat(this.options.length||this._helpOption!==null?"[options]":[],this.commands.length?"[command]":[],this.registeredArguments.length?t:[]).join(" ")}return this._usage=e,this}name(e){return e===void 0?this._name:(this._name=e,this)}nameFromFilename(e){return this._name=g.basename(e,g.extname(e)),this}executableDir(e){return e===void 0?this._executableDir:(this._executableDir=e,this)}helpInformation(e){const t=this.createHelp();return t.helpWidth===void 0&&(t.helpWidth=e&&e.error?this._outputConfiguration.getErrHelpWidth():this._outputConfiguration.getOutHelpWidth()),t.formatHelp(this,t)}_getHelpContext(e){e=e||{};const t={error:!!e.error};let i;return t.error?i=n=>this._outputConfiguration.writeErr(n):i=n=>this._outputConfiguration.writeOut(n),t.write=e.write||i,t.command=this,t}outputHelp(e){let t;typeof e=="function"&&(t=e,e=void 0);const i=this._getHelpContext(e);this._getCommandAndAncestors().reverse().forEach(s=>s.emit("beforeAllHelp",i)),this.emit("beforeHelp",i);let n=this.helpInformation(i);if(t&&(n=t(n),typeof n!="string"&&!Buffer.isBuffer(n)))throw new Error("outputHelp callback must return a string or a Buffer");i.write(n),this._getHelpOption()?.long&&this.emit(this._getHelpOption().long),this.emit("afterHelp",i),this._getCommandAndAncestors().forEach(s=>s.emit("afterAllHelp",i))}helpOption(e,t){return typeof e=="boolean"?(e?this._helpOption=this._helpOption??void 0:this._helpOption=null,this):(e=e??"-h, --help",t=t??"display help for command",this._helpOption=this.createOption(e,t),this)}_getHelpOption(){return this._helpOption===void 0&&this.helpOption(void 0,void 0),this._helpOption}addHelpOption(e){return this._helpOption=e,this}help(e){this.outputHelp(e);let t=m.exitCode||0;t===0&&e&&typeof e!="function"&&e.error&&(t=1),this._exit(t,"commander.help","(outputHelp)")}addHelpText(e,t){const i=["beforeAll","before","after","afterAll"];if(!i.includes(e))throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${i.join("', '")}'`);const n=`${e}Help`;return this.on(n,s=>{let r;typeof t=="function"?r=t({error:s.error,command:s.command}):r=t,r&&s.write(`${r}
`)}),this}_outputHelpIfRequested(e){const t=this._getHelpOption();t&&e.find(n=>t.is(n))&&(this.outputHelp(),this._exit(0,"commander.helpDisplayed","(outputHelp)"))}};function T(h){return h.map(e=>{if(!e.startsWith("--inspect"))return e;let t,i="127.0.0.1",n="9229",s;return(s=e.match(/^(--inspect(-brk)?)$/))!==null?t=s[1]:(s=e.match(/^(--inspect(-brk|-port)?)=([^:]+)$/))!==null?(t=s[1],/^\d+$/.test(s[3])?n=s[3]:i=s[3]):(s=e.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/))!==null&&(t=s[1],i=s[3],n=s[4]),t&&n!=="0"?`${t}=${i}:${parseInt(n)+1}`:e})}N.Command=me;const{Argument:W}=$,{Command:k}=N,{CommanderError:de,InvalidArgumentError:q}=b,{Help:pe}=y,{Option:M}=w;f.program=new k,f.createCommand=h=>new k(h),f.createOption=(h,e)=>new M(h,e),f.createArgument=(h,e)=>new W(h,e),f.Command=k,f.Option=M,f.Argument=W,f.Help=pe,f.CommanderError=de,f.InvalidArgumentError=q,f.InvalidOptionArgumentError=q;const{program:ke,createCommand:Se,createArgument:Ne,createOption:Pe,CommanderError:Ie,InvalidArgumentError:De,InvalidOptionArgumentError:Fe,Command:fe,Argument:Te,Option:We,Help:qe}=f;try{v("doctl version")}catch{console.error("doctl is not installed. Please make sure to install it before running this script."),A.exit(1)}try{v("doctl account get")}catch{console.error("doctl is not authenticated. Please make sure to authenticate before running this script."),A.exit(1)}const j=new fe;j.name("delete-docker-tags").description("Delete old Docker tags from DigitalOcean container registry").requiredOption("-r, --registry-name <name>","Name of the DigitalOcean container registry").requiredOption("-k, --keep-versions <number>","Number of recent versions to keep","5").option("-s, --keep-semver <number>","Number of unique semver versions to keep","0").option("-d, --retention-days <number>","Number of days to retain tags regardless of keep-versions","0").option("--dry-run","Perform a dry run without actually deleting tags",!1).option("-i, --include-repos <patterns...>","Glob patterns to include specific repositories").option("-e, --exclude-repos <patterns...>","Glob patterns to exclude specific repositories").option("--repo-concurrency <number>","Number of repositories to process concurrently","3").option("--tag-concurrency <number>","Number of tags to delete concurrently per repository","3").parse(A.argv);const _=j.opts();async function ge(){try{await J(_.registryName,Number.parseInt(_.keepVersions,10),Number.parseInt(_.keepSemver,10),Number.parseInt(_.retentionDays,10),_.dryRun,_.includeRepos||[],_.excludeRepos||[],console.log,v,Number.parseInt(_.repoConcurrency,10),Number.parseInt(_.tagConcurrency,10))}catch(h){console.error(`An error occurred: ${h.message}`),A.exit(1)}}ge();
