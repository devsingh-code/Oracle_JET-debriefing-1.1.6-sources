"use strict";define(["knockout","./abstract-collection","./catalog-model"],(e,t,r)=>{return class extends t{constructor(){super()}getByIdOrCreate(e){return super.getByIdOrCreate(e)}static createEmptyModel(e){return new r({id:e,name:"",fieldSchemas:[],typeSchemas:[]})}}});