import { WSAction, WSPayloadTypes } from "../@types/wsActions";

export interface IWSMessage {

}
class WsService {
    private connection: WebSocket;
    private eventsMap: Map<WSAction, Array<(p: any) => void>> =  new Map()

    constructor() {
        this.connection = new WebSocket('wss://ws.achex.ca/');
    }

    send(hubName: string, data: any) {
        this.connection.send(JSON.stringify({
            toH: hubName, 
            data
        }))
    }

    start(hubName: string, userName: string) {

        this.connection.onmessage = (evt) => {
            if(evt && evt.data){
                const data = JSON.parse(evt.data);
                console.info(data);

                if (data.action && this.eventsMap.has(data.action)) {
                    this.eventsMap.get(data.action)?.forEach(c => {
                        c(data.payload);
                    })
                }
            }
        }

        this.connection.onopen = () => {
            this.connection.send( JSON.stringify({"auth":userName,"passwd":'111'}));
            this.connection.send( JSON.stringify({"joinHub":hubName}));
        };
    }

    on<T extends WSAction>(action: T, callback: (payload: WSPayloadTypes[T]) => void){
        if (!this.eventsMap.has(action)) this.eventsMap.set(action, []);
        const cur = this.eventsMap.get(action) || [];
        this.eventsMap.set(action, [...cur, callback])
    }

    off<T extends WSAction>(action: T, callback: (payload: WSPayloadTypes[T]) => void){
        if (!this.eventsMap.has(action)) return;

        this.eventsMap.set(action, (this.eventsMap.get(action) || []).filter(x => x !== callback))
    }
}

const wsService = new WsService();

export default wsService;