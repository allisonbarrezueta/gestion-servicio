import { Model } from "@tailflow/laravel-orion/lib/model";

export type RootStackParamList = {
    Root: undefined;
    NotFound: undefined;
    Login: undefined;
    Register: undefined;
    Inicio: undefined;
    RegisterForm: { type?: string };
    RegisterStepTwo: { email: string; password: string; name: string; last_name: string; dni: string; type: string };
    RegisterStepThree: {
        email: string;
        password: string;
        name: string;
        last_name: string;
        dni: string;
        type: string;
        rucImage: string;
        dniImage: string;
        ruc: string;
    };
};

export type BottomTabParamList = {
    TabOne: undefined;
    TabTwo: undefined;
    Inicio: undefined;
    "Mis Ordenes": undefined;
    Servicios: undefined;
    Puja: undefined;
    "Por Realizar": undefined;
    Subasta: undefined;
};

export type TabOneParamList = {
    TabOneScreen: undefined;
    Puja: undefined;
    "Solicitudes de Servicio": { category: Model<CategoryType> };
    "Solicitar Servicio": { category: Model<CategoryType> };
    "Solicitud de Servicio": { request: Model<RequestType> };
    "Realizar Oferta": { request: Model<RequestType> };
    Subasta: undefined;
    "Detalle de Cliente": { user: Model<UserType> };
};

export type TabTwoParamList = {
    TabOne: undefined;
    History: undefined;
    Scheduled: undefined;
    Service: { request: Model<RequestType> };
    InProcess: undefined;
    ActiveOffers: undefined;
    FinishService: { request: Model<RequestType> };
    "Por Realizar": undefined;
};

export type MyBidsParamsList = {
    Subasta: undefined;
    ActiveOffers: undefined;
    ActiveOffer: { request: Model<RequestType> };
    InactiveOffers: undefined;
    ScheduleOffers: undefined;
    EditOffer: { bid: Model<BidType>; request: Model<RequestType> };
};

export type TabThreeParamList = {
    Bids: undefined;
    Offers: { request: Model<RequestType> };
    Offer: { bid: Model<BidType> };
    PayOffer: { bid: Model<BidType> };
    Pay: { bid: Model<BidType> };
    Comments: { user: Model<UserType> };
    Scheduled: undefined;
    SelectBids: undefined;
    InactiveBidsScreen: undefined;
    "Detalle de Cliente": { user: Model<UserType> };
};

export type ServiceType = {
    id: number;
    name: string;
    slug: string;
    image: string;
    status: boolean;
    category_id: number;
    requests_count: number;
};

export type CategoryType = {
    id: number;
    name: string;
    slug: string;
    image: string;
    status: boolean;
    services_count: number;
};

export type RequestType = {
    user_id: number;
    service_id: number | null | undefined;
    category_id: number | undefined;
    date: string;
    address: string;
    description: string;
    status?: string;
    bids_count?: number;
    image: string | null;
};

export type BidType = {
    id: number;
    user_id: number;
    request_id: number;
    description: string;
    offer: number;
    status: string;
};

export type UserType = {
    id: number;
    address?: string;
    average_rating: number;
    created_at: string;
    dni: string;
    email: string;
    email_verified_at?: string;
    last_name: string;
    name: string;
    phone: string;
    company_name?: string;
    approved: boolean;
    company_description?: string;
    ruc?: string;
    ratings?: RatingsEntity[] | null;
    total_opinions: number;
    type: string;
};

export type RatingsEntity = {
    percentage: number;
    rating: number;
    total: number;
};

export type OpinionType = {
    id: number;
    user_id: number;
    supplier_id: number | undefined;
    request_id: number;
    comment: string;
    rating: number;
    status: boolean;
    created_at: string;
    updated_at: string;
};
