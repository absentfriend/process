package org.apdplat.platform.action;

import org.apdplat.platform.model.Model;
import org.apdplat.platform.result.Page;
import org.apdplat.platform.service.ServiceFacade;
import org.apdplat.platform.util.SpringContextUtils;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;

/**
 *
 *控制器接口的抽象实现类
 *
 * @author sun
 */
public abstract class SimpleAction<T extends Model> extends ActionSupport implements Action {

    @Resource(name = "serviceFacade")
    protected ServiceFacade service;
    protected T model = null;
    private Class<T> modelClass;
    protected Page<T> page = new Page<>();
    @Resource(name = "springContextUtils")
    protected SpringContextUtils springContextUtils;

    @PostConstruct
    private void initModel() {
        if (this.model == null) {
            String modelName=getDefaultModelName();
            if("model".equals(modelName)){
                this.model = (T)super.getRequest().getAttribute("model");
            }else{
                this.model = (T) springContextUtils.getBean(modelName);
            }
            modelClass=(Class<T>)model.getClass();
        }
    }

    private String getDefaultModelName(){
        return super.getDefaultModelName(this.getClass());
    }

    /**
     * 在添加及更新一个特定的完整的Model之前对Model的组装，以确保组装之后的Model是一个语义完整的模型
     * @return
     */
    public T assemblyModel(T model) {
        return model;
    }

    @Override
    public String create() {
        service.create(assemblyModel(model));

        super.setFeedback(new Feedback(model.getId(), "添加成功"));

        return SUCCESS;
    }

    @Override
    public String createForm() {
        return FORM;
    }

    @Override
    public String retrieve() {
        this.setModel(service.retrieve(modelClass, model.getId()));

        return DETAIL;
    }

    @Override
    public String updateForm() {
        setModel(service.retrieve(modelClass, model.getId()));
        return null;
    }

    @Override
    public String updatePart() {
        service.update(modelClass, model.getId(), getPartProperties(model));

        super.setFeedback(new Feedback(model.getId(), "添加成功"));

        return SUCCESS;
    }

    @Override
    public String updateWhole() {
        service.update(assemblyModel(model));

        super.setFeedback(new Feedback(model.getId(), "更新成功"));

        return SUCCESS;
    }

    @Override
    public String delete() {
        service.delete(modelClass, super.getIds());

        return SUCCESS;
    }

    @Override
    public String query() {
        this.setPage(service.query(modelClass, super.getPageCriteria(), super.buildPropertyCriteria(), super.buildOrderCriteria()));
        return LIST;
    }


    public T getModel() {
        return this.model;
    }

    public void setModel(T model) {
        this.model = model;
    }

    public Page<T> getPage() {
        return page;
    }

    public void setPage(Page<T> page) {
        this.page = page;
    }
}