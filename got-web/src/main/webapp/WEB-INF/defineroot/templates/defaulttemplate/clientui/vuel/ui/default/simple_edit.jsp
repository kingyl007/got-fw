
	<div id="${pageId }">
				<!-- 
		<div id="top">
			<span>
				<el-button type="text" @click="add" style="color:white">添加</el-button>	
				<el-button type="text" @click="deletenames" style="color:white">批量删除</el-button>
			</span>
		</div>
				 -->
		<br />
		<div class="block">
			<el-form ref="form" :model="newData" :rules="rules" label-position="right" label-width="100px" size="mini">
			<c:forEach var="col" items="${validColumns}" varStatus="status">
				<el-form-item label="${col.label }" prop="${col.id }">
				<c:choose>
					<c:when test="${not empty col.dictionary && not empty view.dictMap[col.dictionary]}">
						<el-select v-model="newData['${col.id }']" ${col.multiSelect?'multiple':'' } ${view.dictMap[col.dictionary].canInput?'allow-create':''} placeholder="${col.prompt }" style="width: 90%;">
						    <el-option
						      v-for="key in dictMap['${col.dictionary}']"
						      :key="key"
						      :label="dictMap['${col.dictionary}'][key]"
						      :value="key">
						    </el-option>
						</el-select>
					</c:when>
					<c:when test="${col.ui == 'datetime' }">
						<el-date-picker
					      v-model="newData['${col.id }']"
					      type="datetime"
					      placeholder="${col.prompt }" style="width: 90%;">
						</el-date-picker>
					</c:when>
					<c:when test="${col.ui == 'date' }">
						<el-date-picker
					      v-model="newData['${col.id }']"
					      type="date"
					      placeholder="${col.prompt }" style="width: 90%;">
						</el-date-picker>
					</c:when>
					<c:otherwise>
					  <el-input v-model="newData['${col.id }']" type="${not empty col.ui?col.ui:'text' }" placeholder="${col.prompt }" style="width: 90%;" ${!col.editable?'disabled':'' }></el-input>
					</c:otherwise>
				</c:choose>
				</el-form-item>
			</c:forEach>
			<el-form-item>
				<c:if test="${showAsDialog != '1'}">
					<c:forEach var="act" items="${view.actions}" varStatus="status">
					<c:if test="${act.visible }">
						<el-button type="primary" icon="${act.icon }" >${act.label }</el-button>
					</c:if>
					</c:forEach>
				</c:if>
			    <el-button type="primary" @click="onSubmit" icon="el-icon-edit">立即创建</el-button>
			    <el-button type="" >取消</el-button>
			  </el-form-item>
			</el-form>
		</div>
		<footer align="center">
			<p>&copy; Spring Boot Demo</p>
		</footer>
	</div>