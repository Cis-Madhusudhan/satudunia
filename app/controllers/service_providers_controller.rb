class ServiceProvidersController < ApplicationController
  before_filter :login_required, :except => [:index, :show]
  before_filter :check_permissions, :except => [:index, :show]
  layout "experiment"

  def index
    set_page_title("Services Map")
    conditions = {}
    conditions = {:service_category_id => params[:category_id]} if params[:category_id]
    
    @alphabetical_providers ||= []
    letter_counter = 0
    @service_providers = ServiceProvider.where(conditions)
    @group_providers = @service_providers.group_by{|provider| provider.name[0].downcase}
    @group_providers.keys.sort.each do |starting_letter|
      letter_counter = 0 if starting_letter.downcase <= "j"
      letter_counter = 1 if starting_letter.downcase > "j" && starting_letter.downcase <= "t"
      letter_counter = 2 if starting_letter.downcase > "t"
      @group_providers[starting_letter].each do |provider|
        @alphabetical_providers[letter_counter] ||= []
        @alphabetical_providers[letter_counter] << provider
      end
    end
    @categories = ServiceCategory.all
    # all service alphabetical_providers    
    if params[:service_search] && !params[:service_search].blank?
      @serviceProviders = ServiceProvider.where({:name=>/#{params[:service_search]}/}).page(params["page"]).per(15)

      @serviceProviders = ServiceProvider.where({:name=>Regexp.new(params[:service_search],true),:country=>Regexp.new(params[:country],true)}).page(params["page"]).per(15) if (params[:country] && !params[:country].blank?)

    elsif(params[:country] && !params[:country].blank?)        
        @serviceProviders = ServiceProvider.where({:country=>Regexp.new(params[:country],true)}).page(params["page"]).per(15)
    else
      @serviceProviders = ServiceProvider.all.page(params["page"]).per(15)      
    end
    respond_to do |format|
      format.html
      format.js
    end
  end

  def show
    
      @service_provider = ServiceProvider.by_slug(params[:slug])

      if @service_provider.nil?
        flash[:error] = "Service Provider not found"
        redirect_to service_providers_path
      else
        set_page_title(@service_provider.name)
      end
  end
  
  def create
    @provider = ServiceProvider.new(params[:service_provider])
    if @provider.save
      @provider.service_category_id = params[:service_provider][:service_category_id]
      @provider.save
      
      flash[:notice] = "Service Provider created"
      
      redirect_to manage_service_providers_path
    else
      flash[:error] = @provider.errors.first[1] rescue "Please fill all the required inputs"
      
      redirect_to manage_service_providers_path
    end
  end
  
  def update
    @provider = ServiceProvider.by_slug(params[:id])
    if @provider.nil?
      flash[:error] = "Service Provider not found"
      
      redirect_to manage_service_providers_path
    else
      if @provider.update_attributes(params[:service_provider])
        @provider.service_category_id = params[:service_provider][:service_category_id]
        @provider.save
        
        flash[:notice] = "#{@provider.name} updated"
        
        redirect_to manage_service_providers_path
      else
        flash[:error] = @provider.errors.first[1] rescue "Please fill all the required inputs"
        
        redirect_to manage_service_providers_path
      end
    end
  end
  
  protected
  def check_permissions
    @group = current_group

    if !current_user.owner_of?(@group)
      flash[:notice] = t("global.permission_denied")
      redirect_to domain_url(:custom => current_group.domain)
    end
  end
end
